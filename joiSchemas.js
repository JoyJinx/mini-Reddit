const Joi = require("joi");

module.exports.pageSchema = Joi.object({
  page: Joi.object({
    author: Joi.string(),
    title: Joi.string().required(),
    body: Joi.string().required(),
    img: Joi.object().empty(""),
    comments: Joi.array(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    author: Joi.string(),
    body: Joi.string().required(),
  }).required(),
});
