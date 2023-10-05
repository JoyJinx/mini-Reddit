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
    title: Joi.string()
      .required()
      .pattern(/(ْ+|ٌ+|ٍ+|ً+|ُ+|ِ+|َ+|ّ+|ٓ+|ٰ+|ٔ+)/, { invert: true })
      .escapeHTML(),
    body: Joi.string()
      .required()
      .pattern(/(ْ+|ٌ+|ٍ+|ً+|ُ+|ِ+|َ+|ّ+|ٓ+|ٰ+|ٔ+)/, { invert: true })
      .escapeHTML(),
    img: Joi.object().empty(""),
    comments: Joi.array(),
  }).required(),
  removeImg: Joi.string(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    author: Joi.string(),
    body: Joi.string()
      .required()
      .pattern(/(ْ+|ٌ+|ٍ+|ً+|ُ+|ِ+|َ+|ّ+|ٓ+|ٰ+|ٔ+)/, { invert: true })
      .escapeHTML(),
  }).required(),
});

module.exports.registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  password2: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .label("Confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
}).required();
