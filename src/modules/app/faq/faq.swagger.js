const swagger = {
  list: {
    schema: {
      description: 'this will list faq',
      tags: ['app|Faq'],
      summary: 'faq list',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
      },
    },
  },
};

module.exports = swagger;
