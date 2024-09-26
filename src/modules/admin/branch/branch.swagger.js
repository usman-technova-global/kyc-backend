const swagger = {
  list: {
    schema: {
      description: 'this will list branch with pagination',
      tags: ['admin|Branch'],
      summary: 'branches with pagination',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
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
      description: 'this will list branches with pagination and search',
      tags: ['admin|Branch'],
      summary: 'branches with pagination and search',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
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

  detail: {
    schema: {
      description: 'this will get branch details',
      tags: ['admin|Branch'],
      summary: 'get branch details',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  insert: {
    schema: {
      description: 'this will insert new branch',
      tags: ['admin|Branch'],
      summary: 'insert new branch',
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
      body: {
        type: 'object',
        properties: {
          tenantName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          userLimit: { type: 'number', default: 0 },
          // domain: { type: 'string' },
          address: { type: 'string' },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
          },
        },
        required: [
          'tenantName',
          'email',
          'firstName',
          'lastName',
          'address',
          'userLimit',
          'userId',
        ],
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

  update: {
    schema: {
      description: 'this will update tenant',
      tags: ['admin|Branch'],
      summary: 'update tenant',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'branch ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          tenantName: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          userLimit: { type: 'number', default: 0 },
          // domain: { type: 'string' },
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
          },
        },
        required: [
          'tenantName',
          'firstName',
          'lastName',
          'userLimit',
          'userId',
        ],
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
      description: 'this will update tenant status',
      tags: ['admin|Branch'],
      summary: 'update tenant status',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
          updatedBy: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
          },
        },
        required: ['isActive', 'updatedBy'],
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
