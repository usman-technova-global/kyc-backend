const Joi = require('joi');

const viewConfig = Joi.object({
  tenantId: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

module.exports = { viewConfig };
