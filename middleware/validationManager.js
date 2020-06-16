const to = require("await-to-js").default;

const User = require("../models/validation/user");
const Tour = require("../models/validation/tour");
const Exhibit = require("../models/validation/exhibit");

const validationSchema = {
  user: User,
  tour: Tour,
  exhibit: Exhibit,
};

const validate = (model) => async ({ method, body }, res, next) => {
  if (method != "POST" && method != "PUT") return next();

  const [error] = await to(
    validationSchema[model.toLowerCase()].validateAsync(body, {
      abortEarly: false,
    })
  );
  if (error) return res.status(400).json(error);

  return next();
};

module.exports = {
  validate,
};
