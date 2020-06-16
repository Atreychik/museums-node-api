const to = require("await-to-js").default;

const Tour = require("../models/data/tour");
const { GUIDE, VISITOR } = require("../constant/roles");

const getSearchParams = ({ userId, userRole }) => {
  switch (userRole) {
    case GUIDE:
      return { guide: userId };
    case VISITOR:
      return { visitors: { $in: [userId] } };
    default:
      return {};
  }
};

const getUsersTours = async (req, res, next) => {
  const searchParams = getSearchParams(res.locals);
  const [error, data] = await to(Tour.find(searchParams));

  if (error) return next(new Error(`Error at fetching user's tours`));
  if (!data.length) return res.status(404).send();

  res.status(200).json(data);
};

const updateVisitors = ({ action }) => async (req, res, next) => {
  const { userId, userRole } = res.locals;
  const id = userRole === VISITOR ? userId : req.body.id;

  const [error, data] = await to(
    Tour.findByIdAndUpdate(
      req.params.id,
      { [action]: { visitors: id } },
      { new: true }
    )
  );

  if (error) return res.status(404).send();

  res.status(200).json(data);
};

module.exports = {
  getUsersTours,
  updateVisitors,
};
