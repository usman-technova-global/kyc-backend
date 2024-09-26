const swagger = {
  list: {
    schema: {
      description: 'this will list rating',
      tags: ['superAdmin|Rating'],
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
    },
  },
  reviews: {
    schema: {
      description: 'this will list reviews',
      tags: ['superAdmin|Rating'],
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
    },
  },
  detailHomeCatItem: {
    schema: {
      description: 'this will list reviews',
      tags: ['superAdmin|Rating'],
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
    },
  },
  distinctStarList: {
    schema: {
      description: 'this will list reviews',
      tags: ['superAdmin|Rating'],
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
    },
  },
  updateStatus: {
    schema: {
      description: 'this will status update',
      tags: ['superAdmin|Rating'],
      summary: 'status update',
      params: {
        type: 'object',
        properties: {
          rating: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['rating'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
