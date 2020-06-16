const Joi = require("@hapi/joi");

const Tour = Joi.object({
  theme: Joi.string().min(3).max(30).normalize().trim().required(),
  exhibitsType: Joi.string().min(3).max(30).normalize().trim().required(),
  duration: Joi.number().integer().positive().required(),
  cost: Joi.number().positive().required(),
  image: Joi.string().required(),
  guide: Joi.string().required(),
  visitors: Joi.array().items(Joi.string()),
  exhibits: Joi.array().items(Joi.string()),
});

module.exports = Tour;
