const swagger = {
  registerDevice: {
    schema: {
      description: 'this will register app user device',
      tags: ['app|UserDevice'],
      summary: 'register app user device',
      body: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          deviceType: { type: 'string', enum: ['Android', 'IOS', 'Web'] },
          name: { type: 'string' },
          isNotificationAllowed: { type: 'boolean', default: false },
          deviceId: { type: 'string' },
          tenant: { type: 'string', format: 'uuid' },
          appUser: { type: 'string', format: 'uuid' },
        },
        required: ['token', 'deviceType', 'name', 'deviceId'],
        additionalProperties: false,
      },
    },
  },
};
module.exports = swagger;
