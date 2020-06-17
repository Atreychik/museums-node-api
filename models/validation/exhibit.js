const Joi = require("@hapi/joi");

const NewExhibit = Joi.object({
  title: Joi.string().min(3).max(30).normalize().trim().required(),
  dated: Joi.string().min(3).max(30).normalize().trim().required(),
  material: Joi.string().min(3).max(30).normalize().trim().required(),
  archiveId: Joi.string().min(3).max(10).normalize().trim().required(),
  description: Joi.string().min(3).normalize().trim().required(),
  image: Joi.string().required(),
});

const UpdatedExhibit = Joi.object({
  title: Joi.string().min(3).max(30).normalize().trim().required(),
  dated: Joi.string().min(3).max(30).normalize().trim().required(),
  material: Joi.string().min(3).max(30).normalize().trim().required(),
  archiveId: Joi.string().min(3).max(10).normalize().trim().required(),
  description: Joi.string().min(3).normalize().trim().required(),
  image: Joi.string().required(),
});

module.exports = { NewExhibit, UpdatedExhibit };
