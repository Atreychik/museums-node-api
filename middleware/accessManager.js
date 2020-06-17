const to = require("await-to-js").default;

const { ADMIN } = require("../constant/roles");
const { verifyToken, getAccessToken } = require("../utils/tokensManager");

const isAuthenticated = async (req, res, next) => {
  const accessToken = getAccessToken(req);
  if (!accessToken) return res.status(401).send();

  const [error, { id, role, isAproved }] = await verifyToken(accessToken);
  if (error) return res.status(401).send();

  res.locals.userId = id;
  res.locals.userRole = role;
  res.locals.isAproved = isAproved;

  return next();
};

const hasAccess = (roles) => async (req, res, next) => {
  const { userRole, isAproved } = res.locals;
  const isUserHasAccess = roles.includes(userRole);

  if (!isUserHasAccess || !isAproved)
    return res.status(403).send({ message: "User don't have a permission!" });

  return next();
};

const isOwner = ({ model, findBy = "_id", identifyBy = "_id" }) => async (
  req,
  res,
  next
) => {
  const { userRole, userId } = res.locals;
  const { id } = req.params;

  const [error, data] = await to(model.findOne({ [findBy]: id }));
  if (error || !data) return res.status(404).send();

  const isAdmin = userRole == ADMIN;
  const isOwner = userId == data[identifyBy];

  if (!isAdmin && !isOwner)
    return res.status(403).json({ message: "You don't have a permissions!" });

  return next();
};

module.exports = {
  isAuthenticated,
  hasAccess,
  isOwner,
};
