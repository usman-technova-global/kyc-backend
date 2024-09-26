const swagger = {
  list: {
    schema: {
      description: 'this will pagination list',
      tags: ['admin|OrderAssign'],
      summary: 'pagination list',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          page: { type: 'integer', format: 'int32', minimum: 0, default: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10, default: 10 },
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
      tags: ['admin|OrderAssign'],
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
  create: {
    schema: {
      description: `this will status update`,
      tags: ['admin|OrderAssign'],
      summary: `status update`,
      body: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: [
              'Driver-Assigned-For-Item-Pickup',
              'Driver-Assigned-For-Item-Delivery',
            ],
          },
          app_user: {
            type: 'string',
            format: 'uuid',
            description: 'driver ID',
          },
          app_user_shop: {
            type: 'string',
            format: 'uuid',
            description: 'driver ID',
          },
          app_order: {
            type: 'string',
            format: 'uuid',
            description: 'order ID',
          },
        },
        required: ['status', 'app_user', 'app_order'],
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
