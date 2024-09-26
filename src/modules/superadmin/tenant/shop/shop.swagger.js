const swagger = {
  tenantList: {
    schema: {
      description: 'this will list tenants with pagination',
      tags: ['superAdmin|Shop'],
      summary: 'tenants with pagination',
      params: {
        type: 'object',
        properties: {
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
        required: ['page', 'size'],
        additionalProperties: false,
      },
    },
  },

  search: {
    schema: {
      description: 'this will list tenants with pagination and search',
      tags: ['superAdmin|Shop'],
      summary: 'tenants with pagination and search',
      params: {
        type: 'object',
        properties: {
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
        required: ['search', 'page', 'size'],
        additionalProperties: false,
      },
    },
  },

  detail: {
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

  detailUser: {
    schema: {
      description: 'this will get tenant user details',
      tags: ['superAdmin|Shop'],
      summary: 'get tenant user details',
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

  insert: {
    schema: {
      description: 'this will insert new tenant',
      tags: ['superAdmin|Shop'],
      summary: 'insert new tenant',
      body: {
        type: 'object',
        properties: {
          tenantName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', format: 'uuid' },
          maxBranchLimit: { type: 'number', default: 0 },
          maxUserLimit: { type: 'number', default: 0 },
          domain: { type: 'string' },
          trialMode: { type: 'boolean' },
          trialModeLimit: { type: 'number' },
          address: { type: 'string' },
          theme: { type: 'array', items: { type: 'string' } },
        },
        required: ['tenantName', 'email', 'firstName', 'lastName', 'address'],
        additionalProperties: false,
      },
    },
  },

  update: {
    schema: {
      description: 'this will update tenant',
      tags: ['superAdmin|Shop'],
      summary: 'update tenant',
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
      body: {
        type: 'object',
        properties: {
          tenantName: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string' },
          maxBranchLimit: { type: 'number' },
          maxUserLimit: { type: 'number' },
          domain: { type: 'string' },
          trialMode: { type: 'boolean' },
          trialModeLimit: { type: 'number' },
          theme: { type: 'array', items: { type: 'string' } },
        },
        required: ['tenantName'],
        additionalProperties: false,
      },
    },
  },

  updateStatus: {
    schema: {
      description: 'this will update tenant status',
      tags: ['superAdmin|Shop'],
      summary: 'update tenant status',
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
    },
  },
};

module.exports = swagger;
