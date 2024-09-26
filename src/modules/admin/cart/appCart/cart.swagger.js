const swagger = {
  list: {
    schema: {
      description: 'this will list carts',
      tags: ['admin|Cart'],
      summary: 'list carts',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
          },
          page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            description: 'page number',
          },
          size: {
            type: 'integer',
            format: 'int32',
            default: 10,
            description: 'list size',
          },
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
      description: 'this will search cart',
      tags: ['admin|Cart'],
      summary: 'search cart',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
          },
          search: {
            type: 'string',
            description: 'search string',
          },
          page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            description: 'page number',
          },
          size: {
            type: 'integer',
            format: 'int32',
            default: 10,
            description: 'list size',
          },
        },
        required: ['tenant', 'search', 'page', 'size'],
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
      description: 'this will get cart details',
      tags: ['admin|Cart'],
      summary: 'get cart details',
      params: {
        type: 'object',
        properties: {
          cartId: {
            type: 'string',
            format: 'uuid',
            description: 'Cart Id',
          },
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
};

module.exports = swagger;
