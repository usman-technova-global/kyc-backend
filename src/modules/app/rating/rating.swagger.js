const swagger = {
  list: {
    schema: {
      description: 'this will list rating',
      tags: ['app|Rating'],
      summary: 'rating list',
      params: {
        type: 'object',
        properties: {
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
        required: ['page', 'size'],
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
  insert: {
    schema: {
      description: 'this will add rating',
      tags: ['app|Rating'],
      summary: 'rating add',
      params: {
        type: 'object',
        properties: {
          appOrderItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['appOrderItem'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      body: {
        type: 'object',
        properties: {
          star: { type: 'integer', format: 'int32', default: 0 },
          review: { type: 'string', default: null },
          status: { type: 'string', enum: ['Leave', 'Completed'] },
        },
        additionalProperties: false,
      },
    },
  },
  reviews: {
    schema: {
      description: 'this will list reviews',
      tags: ['app|Rating'],
      summary: 'reviews list',
      querystring: {
        page: { type: 'integer', format: 'int32', default: 0, minimum: 0 },
        size: { type: 'integer', format: 'int32', default: 10, minimum: 10 },
      },
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          homeCatItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant', 'homeCatItem'],
        additionalProperties: false,
      },
    },
  },
  distinctStarList: {
    schema: {
      description: 'this will list reviews',
      tags: ['app|Rating'],
      summary: 'reviews list',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          homeCatItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant', 'homeCatItem'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
