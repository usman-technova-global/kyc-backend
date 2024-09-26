const swagger = {
  list: {
    schema: {
      description: 'this will list rating',
      tags: ['admin|Rating'],
      summary: 'rating list',
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
      },
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
  detailHomeCatItem: {
    schema: {
      description: 'this will list reviews',
      tags: ['admin|Rating'],
      summary: 'reviews list',
      params: {
        type: 'object',
        properties: {
          homeCatItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['homeCatItem'],
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
  reviews: {
    schema: {
      description: 'this will list reviews',
      tags: ['admin|Rating'],
      summary: 'reviews list',
      querystring: {
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
      },
      params: {
        type: 'object',
        properties: {
          homeCatItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['homeCatItem'],
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
  distinctStarList: {
    schema: {
      description: 'this will list reviews',
      tags: ['admin|Rating'],
      summary: 'reviews list',
      params: {
        type: 'object',
        properties: {
          homeCatItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['homeCatItem'],
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
