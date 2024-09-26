const swagger = {
  list: {
    schema: {
      description: 'this will get notification',
      tags: ['app|notification'],
      summary: 'get notification',
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
