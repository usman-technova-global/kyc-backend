const swagger = {
  list: {
    schema: { hide: true },
  },
  view: {
    schema: {
      description: 'this will view permission',
      tags: ['superAdmin|Permission'],
      summary: 'view permission',
      params: {
        type: 'object',
        properties: {
          permissionId: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['permissionId'],
        additionalProperties: false,
      },
    },
  },
  create: {
    schema: {
      description: 'this will create permission',
      tags: ['superAdmin|Permission'],
      summary: 'create permission',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
          permissionType: { type: 'string' },
          createdBy: {
            type: 'string',
            format: 'uuid',
            description: 'App Uer ID',
          },
          data: { type: 'array' },
        },
        required: ['name', 'desc', 'permissionType'],
        additionalProperties: false,
      },
    },
  },

  update: {
    schema: {
      description: 'this will update permission',
      tags: ['superAdmin|Permission'],
      summary: 'update permission',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'App Uer ID',
          },
          name: { type: 'string' },
          desc: { type: 'string' },
          permissionType: { type: 'string' },
          updatedBy: {
            type: 'string',
            format: 'uuid',
            description: 'App Uer ID',
          },
          data: { type: 'array' },
        },
        required: ['name', 'desc', 'permissionType'],
        additionalProperties: false,
      },
    },
  },

  updateStatus: {
    schema: {
      description: `this will status update permission`,
      tags: ['superAdmin|Permission'],
      summary: `status update permission`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['isActive', 'updatedBy'],
        additionalProperties: false,
      },
    },
  },
  paginationList: {
    schema: {
      description: 'this will pagination list',
      tags: ['superAdmin|Permission'],
      summary: 'pagination list',
      params: {
        type: 'object',
        properties: {
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['page', 'size'],
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
  paginationSearch: {
    schema: {
      description: 'this will pagination search',
      tags: ['superAdmin|Permission'],
      summary: 'pagination search',
      params: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      },
    },
  },
  edit: {
    schema: {
      description: 'this will edit',
      tags: ['superAdmin|Permission'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
  },
  childList: {
    schema: {
      description: 'this will child list',
      tags: ['superAdmin|Permission'],
      summary: 'child list',
      params: {
        type: 'object',
        properties: {
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['page', 'size', 'id'],
        additionalProperties: false,
      },
    },
  },
  childsearch: {
    schema: {
      description: 'this will child list',
      tags: ['superAdmin|Permission'],
      summary: 'child list',
      params: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['page', 'size', 'id'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
