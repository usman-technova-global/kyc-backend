const Joi = require('joi');

const createSchema = Joi.object({
  email: Joi.string().required(),
});

module.exports = { createSchema };
