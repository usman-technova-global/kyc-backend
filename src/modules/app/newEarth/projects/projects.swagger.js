const swagger = {
  list: {
    schema: {
      description: 'this will list projects',
      tags: ['New Earth|Projects'],
      summary: 'list projects',
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
        page: { type: 'integer', format: 'int32', default: 0, minimum: 0 },
        size: { type: 'integer', format: 'int32', default: 10, minimum: 10 },
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

  listLov: {
    schema: {
      description: 'this will list projects',
      tags: ['New Earth|Projects'],
      summary: 'list projects',
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
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
