const swagger = {
  detail: {
    schema: {
      description: 'this will edit',
      tags: ['admin|CategoryServiceFaq'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          tenantId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenantId'],
        additionalProperties: false,
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
