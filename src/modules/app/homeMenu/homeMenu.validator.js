const Joi = require('joi');

const listHomeMenu = Joi.object({
  tenantId: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

const viewHomeMenu = Joi.object({
  tenantId: Joi.string().guid({
    version: ['uuidv4'],
  }),
  menuId: Joi.string().guid({
    version: ['uuidv4'],
  }),
});
const viewHomeSubmenu = Joi.object({
  tenantId: Joi.string().guid({
    version: ['uuidv4'],
  }),
  menuId: Joi.string().guid({
    version: ['uuidv4'],
  }),
  submenuId: Joi.string().guid({
    version: ['uuidv4'],
  }),
});

module.exports = { listHomeMenu, viewHomeMenu, viewHomeSubmenu };
