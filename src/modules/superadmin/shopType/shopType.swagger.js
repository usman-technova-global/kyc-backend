const swagger = {
  list: {
    schema: {
      description: 'this will list shop type',
      tags: ['superAdmin|adminShopType'],
      summary: 'shopType list',
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
      },
    },
  },

  create: {
    schema: {
      description: 'this will create shop type',
      tags: ['superAdmin|adminShopType'],
      summary: 'shopType create',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false,
      },
    },
  },

  find: {
    schema: {
      description: `this will find shop type`,
      tags: ['superAdmin|theme'],
      summary: `shop type find`,
      params: {
        type: 'object',
        properties: {
          shopTypeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['shopTypeId'],
        additionalProperties: false,
      },
    },
  },

  update: {
    schema: {
      description: 'this will update shop type',
      tags: ['superAdmin|adminShopType'],
      summary: 'shopType update',
      params: {
        type: 'object',
        properties: {
          shopTypeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['shopTypeId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
        },
        required: ['name'],
        additionalProperties: false,
      },
    },
  },

  updateStatus: {
    schema: {
      description: `this will update status of shop type`,
      tags: ['superAdmin|adminShopType'],
      summary: `status update`,
      params: {
        type: 'object',
        properties: {
          shopTypeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['shopTypeId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
        },
        required: ['isActive'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
