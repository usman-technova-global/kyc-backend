const swagger = {
  viewConfig: {
    schema: {
      description: 'this will fetch tenant config',
      tags: ['app|TenantConfig'],
      summary: 'fetch tenant config',
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
};

module.exports = swagger;
