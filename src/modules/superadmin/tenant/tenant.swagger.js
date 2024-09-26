const swagger = {
  create: {
    schema: {
      description: 'this will create new tenant',
      tags: ['superAdmin|Shop'],
      summary: 'create new tenant',
    },
  },

  view: {
    schema: {
      description: 'this will get tenant details',
      tags: ['superAdmin|Shop'],
      summary: 'get tenant details',
      params: {
        type: 'object',
        properties: {
          tenantId: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['tenantId'],
        additionalProperties: false,
      },
    },
  },

  list: {
    schema: {
      description: 'this will list tenants',
      tags: ['superAdmin|Shop'],
      summary: 'list tenants',
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
