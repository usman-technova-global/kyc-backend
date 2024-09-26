const swagger = {
  list: {
    schema: {
      description: 'this will list project attachments',
      tags: ['NewEarth|Project|Attachments'],
      summary: 'list project attachments',
      params: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            format: 'uuid',
          },
        },
        additionalProperties: false,
      },
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
};

module.exports = swagger;
