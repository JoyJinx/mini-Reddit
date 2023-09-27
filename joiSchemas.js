const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: { "string.escapeHTML": "{{#label}} must not include HTML!" },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.pageSchema = Joi.object({
  page: Joi.object({
    author: Joi.string(),
    title: Joi.string().required().escapeHTML(),
    body: Joi.string().required().escapeHTML(),
    img: Joi.object().empty(""),
    comments: Joi.array(),
  }).required(),
  removeImg: Joi.string(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    author: Joi.string(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
