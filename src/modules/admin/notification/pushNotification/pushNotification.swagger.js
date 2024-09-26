const swagger = {
  list: {
    schema: {
      description: 'this will pagination list',
      tags: ['admin|PushNotification'],
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
      tags: ['admin|PushNotification'],
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
  batchDetail: {
    schema: {
      description: 'this will edit',
      tags: ['admin|PushNotification'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
  },
  sent: {
    schema: {
      description: 'this will update category status',
      tags: ['admin|PushNotification'],
      summary: 'update category status',
      body: {
        type: 'object',
        properties: {
          title: { type: 'string', default: '' },
          message: { type: 'string' },
          notificationType: {
            type: 'string',
            enum: ['StaffUsers', 'Customers'],
          },
          userId: {
            type: 'string',
            format: 'uuid',
          },
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['message', 'userId', 'tenant'],
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
