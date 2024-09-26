const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ coerceTypes: true });
addFormats(ajv);

const schemas = {
  services: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid', default: null },
        storeServiceCategoryItem: { type: 'string', format: 'uuid' },
        serviceTime: { type: 'integer', format: 'int32', default: 0 },
        amountType: {
          type: 'string',
          enum: ['None', 'Amount', 'Percentage'],
          default: 'None',
        },
        amount: { type: 'number', default: 0 },
      },
      required: ['storeServiceCategoryItem'],
      additionalProperties: false,
    },
  },
  workDays: {
    type: 'array',
    items: {
      type: 'string',
      enum: [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
    },
  },
  deletedIds: {
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
  },
};

const validator = {
  services: ajv.compile(schemas.services),
  workDays: ajv.compile(schemas.workDays),
  deletedIds: ajv.compile(schemas.deletedIds),
};
module.exports = validator;
