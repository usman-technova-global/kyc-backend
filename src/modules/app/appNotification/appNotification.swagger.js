const swagger = {
  getNotification: {
    schema: {
      description: 'this will fetch user notifications',
      tags: ['app|Notification'],
      summary: 'get user notifications',
      querystring: {
        offset: { type: 'integer', minimum: 0, default: 0 },
        limit: { type: 'integer', minimum: 10, default: 10 },
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
