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

module.exports = {
  isAuthenticated,
  hasAccess,
};
