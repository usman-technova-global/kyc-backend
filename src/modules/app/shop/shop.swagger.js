const swagger = {
  viewShop: {
    schema: {
      description: 'this will fetch tenant shops',
      tags: ['app|Tenant'],
      summary: 'fetch tenants shop',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
