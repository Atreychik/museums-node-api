const Joi = require("@hapi/joi");

const NewUser = Joi.object({
  username: Joi.string().min(3).max(25).normalize().trim().required(),
  password: Joi.string().min(6).max(30).required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(2).max(30).normalize().trim().required(),
  age: Joi.number().integer().required(),
  role: Joi.string().required(),
  experience: Joi.number().integer(),
  languages: Joi.string().normalize().trim(),
  isAproved: Joi.boolean(),
});

const UpdatedUser = Joi.object({
  password: Joi.string().min(6).max(30).required(),
  name: Joi.string().min(2).max(30).normalize().trim().required(),
  age: Joi.number().integer().required(),
  experience: Joi.number().integer(),
  languages: Joi.string().normalize().trim(),
});

module.exports = { NewUser, UpdatedUser };
