const swagger = {
  list: {
    schema: {
      description: 'this will list category',
      tags: ['admin|Category'],
      summary: 'list category',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
          },
          page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            description: 'page number',
          },
          size: {
            type: 'integer',
            format: 'int32',
            default: 10,
            description: 'list size',
          },
        },
        required: ['tenant', 'page', 'size'],
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

  search: {
    schema: {
      description: 'this will search category',
      tags: ['admin|Category'],
      summary: 'search category',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
          },
          search: {
            type: 'string',
            description: 'search string',
          },
          page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            description: 'page number',
          },
          size: {
            type: 'integer',
            format: 'int32',
            default: 10,
            description: 'list size',
          },
        },
        required: ['tenant', 'search', 'page', 'size'],
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

  findById: {
    schema: {
      description: 'this will get category details',
      tags: ['admin|Category'],
      summary: 'get category details',
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            description: 'Category Id',
          },
        },
        required: ['categoryId'],
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

  updateStatus: {
    schema: {
      description: 'this will update category status',
      tags: ['admin|Category'],
      summary: 'update category status',
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            description: 'Category Id',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          is_active: {
            type: 'boolean',
          },
          updated_by: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['is_active'],
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

  deleteCategory: {
    schema: {
      description: 'this will delete category',
      tags: ['admin|Category'],
      summary: 'delete category status',
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            description: 'Category Id',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: {
            type: 'boolean',
          },
          isDeleted: {
            type: 'boolean',
          },
          updatedBy: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['isActive', 'isDeleted'],
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

  create: {
    schema: {
      description: 'this will create category',
      tags: ['admin|Category'],
      summary: 'create category',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          desc: { type: 'string' },
          icon: { isFile: true },
          tenant: { type: 'string', format: 'uuid' },
          created_by: { type: 'string', format: 'uuid' },
          updated_by: { type: 'string', format: 'uuid' },
        },
        required: ['name', 'icon', 'created_by'],
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

  update: {
    schema: {
      description: 'this will update category',
      tags: ['admin|Category'],
      summary: 'update category',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            description: 'Category Id',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          desc: { type: 'string' },
          icon: { isFile: true },
          updated_by: { type: 'string', format: 'uuid' },
        },
        required: ['name', 'updated_by'],
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
