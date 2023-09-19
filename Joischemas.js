const Joi = require("joi");

module.exports.pageSchema = Joi.object({
  page: Joi.object({
    author: Joi.string().required(),
    body: Joi.string().required(),
    img: Joi.string().empty(""),
    comments: Joi.array(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    author: Joi.string().required(),
    body: Joi.string().required(),
  }).required(),
});
