const swagger = {
  get: {
    schema: {
      description: 'this will edit',
      tags: ['admin|Setting'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  getAddress: {
    schema: {
      description: 'this will edit',
      tags: ['admin|Setting'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  update: {
    schema: {
      type: 'object',
      description: 'this will list app image',
      tags: ['admin|Setting'],
      summary: 'list app image',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          logo: { isFile: true },
          desc: { type: 'string' },
          address: { type: 'string', default: null },
          gstPercentage: { type: 'string' },
          minOrderAmount: { type: 'number', default: 0 },
          deliveryFee: { type: 'number', default: 0 },
          userLimit: { type: 'number', default: 0 },
          updatedBy: { type: 'string', format: 'uuid' },
          enableLoyaltyProgram: { type: 'boolean', default: false },
          loyaltyCoinConversionRate: { type: 'number', default: 0 },
          requiredCoinsToRedeem: { type: 'number', default: 0 },
          minimumDeliveryTime: { type: 'number', default: 0 },
          deliveryUrgentFees: { type: 'number', default: 1 },
          latitude: { type: 'number', format: 'float', default: 0 },
          longitude: { type: 'number', format: 'float', default: 0 },
          attendanceDistance: { type: 'integer', format: 'int32', default: 0 },
          officeTimeIn: { type: 'string', format: 'date-time', default: null },
          officeTimeOut: { type: 'string', format: 'date-time', default: null },
        },
        required: ['updatedBy'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  updateMedia: {
    schema: {
      type: 'object',
      description: 'this will list app image',
      tags: ['admin|Setting'],
      summary: 'list app image',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          facebook: { type: 'string', default: '' },
          instagram: { type: 'string', default: '' },
          linkedin: { type: 'string', default: '' },
          twitter: { type: 'string', default: '' },
          youtube: { type: 'string', default: '' },
          whatsapp: { type: 'string', default: '' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['updatedBy'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
};

module.exports = swagger;
