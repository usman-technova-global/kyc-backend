const Joi = require('joi');

const viewShop = Joi.object({
  tenantId: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

module.exports = { viewShop };
