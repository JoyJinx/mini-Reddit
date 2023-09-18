const Joi = require("joi");

const pageSchema = Joi.object({
  page: Joi.object({
    author: Joi.string().required(),
    body: Joi.string().required(),
    img: Joi.string(),
  }).required(),
});

module.exports = pageSchema;
