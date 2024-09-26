const swagger = {
  list: {
    schema: {
      description: 'this will pagination list',
      tags: ['admin|AppOrder'],
      summary: 'pagination list',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['tenant', 'page', 'size'],
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
  search: {
    schema: {
      description: 'this will pagination search',
      tags: ['admin|AppOrder'],
      summary: 'pagination search',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          search: { type: 'string' },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['tenant', 'page', 'size'],
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
  view: {
    schema: {
      description: 'this will view',
      tags: ['admin|AppOrder'],
      summary: 'View details',
      params: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['orderId'],
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
  orderHistory: {
    schema: {
      description: 'this will order history',
      tags: ['admin|AppOrder'],
      summary: 'order history',
      params: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['orderId'],
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
  getItems: {
    schema: {
      description: 'this will view',
      tags: ['admin|AppOrder'],
      summary: 'View details',
      params: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['orderId'],
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
