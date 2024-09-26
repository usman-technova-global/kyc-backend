const swagger = {
  list: {
    schema: {
      description: 'this will list banner',
      tags: ['app|Banner'],
      summary: 'banner list',
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
