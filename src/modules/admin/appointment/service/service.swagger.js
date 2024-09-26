const serviceName = 'service';

const swagger = {
  list: {
    schema: {
      description: `this will list ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `${serviceName} with pagination`,
      params: {
        type: 'object',
        properties: {
          providerId: {
            type: 'string',
            format: 'uuid',
            description: 'providerId ID',
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
        required: ['providerId', 'page', 'size'],
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
      description: `this will search ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `${serviceName} with search`,
      params: {
        type: 'object',
        properties: {
          providerId: {
            type: 'string',
            format: 'uuid',
            description: 'providerId ID',
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
        required: ['providerId', 'search', 'page', 'size'],
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
      description: `this will insert new ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `create new ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
          appointmentProvider: {
            type: 'string',
            format: 'uuid',
            description: 'appointment provider ID',
          },
          fees: { type: 'number', default: 0, minimum: 0 },
          tenant: { type: 'string', format: 'uuid', description: 'tenant ID' },
          createdBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: [
          'name',
          'desc',
          'appointmentProvider',
          'fees',
          'tenant',
          'createdBy',
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
      description: `this will update ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `update new ${serviceName}`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
          appointmentProvider: {
            type: 'string',
            format: 'uuid',
            description: 'appointment provider ID',
          },
          fees: { type: 'number', default: 0, minimum: 0 },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['name', 'desc', 'appointmentProvider', 'fees', 'updatedBy'],
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

  find: {
    schema: {
      description: `this will find ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `find ${serviceName}`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
        },
        required: ['id'],
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
      description: `this will status update ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `status update ${serviceName}`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  del: {
    schema: {
      description: `this will delete ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `delete ${serviceName}`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['updatedBy'],
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

  lovProvider: {
    schema: {
      description: `this will lov providers ${serviceName}`,
      tags: ['admin|ProviderService'],
      summary: `${serviceName} with lov providers`,
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
};

module.exports = swagger;
