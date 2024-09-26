const swagger = {
  listByTenantId: {
    schema: {
      description: 'this will edit',
      tags: ['app|HomeMenu'],
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
    },
  },
  view: {
    schema: {
      description: 'this will edit',
      tags: ['app|HomeMenu'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          tenantId: {
            type: 'string',
            format: 'uuid',
          },
          menuId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenantId', 'menuId'],
        additionalProperties: false,
      },
    },
  },
  viewSubMenu: {
    schema: {
      description: 'this will edit',
      tags: ['app|HomeMenu'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          tenantId: {
            type: 'string',
            format: 'uuid',
          },
          menuId: {
            type: 'string',
            format: 'uuid',
          },
          submenuId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenantId', 'menuId', 'submenuId'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
