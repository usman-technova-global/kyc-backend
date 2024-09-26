const swagger = {
  newOrder: {
    schema: {
      description: 'this will place user order',
      tags: ['app|Order'],
      summary: 'place user order',
      body: {
        type: 'object',
        properties: {
          cartId: { type: 'string', format: 'uuid', description: 'Cart ID' },
        },
        required: ['cartId'],
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

  getPayfastAccessToken: {
    schema: {
      description: 'this will return payfast access token',
      tags: ['app|Order'],
      summary: 'payfast access token',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  orderStatusUpdate: { schema: { hide: true } },

  getOrderList: {
    schema: {
      description: 'this will fetch user orders',
      tags: ['app|Order'],
      summary: 'fetch user orders',
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        offset: { type: 'integer', minimum: 0 },
        limit: { type: 'integer', minimum: 10 },
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

  getList: {
    schema: {
      description: 'this will fetch user orders',
      tags: ['app|Order'],
      summary: 'fetch user orders',
      querystring: {
        offset: { type: 'integer', minimum: 0 },
        limit: { type: 'integer', minimum: 10 },
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

  orderDetail: {
    schema: {
      description: 'this will fetch order detail',
      tags: ['app|Order'],
      summary: 'fetch order detail',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'order ID' },
        },
        required: ['id'],
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
