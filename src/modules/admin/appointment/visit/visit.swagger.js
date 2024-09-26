const serviceName = 'visit';

const swagger = {
  list: {
    schema: {
      description: `this will list ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with pagination`,
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
      description: `this will search ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with search`,
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

  create: {
    schema: {
      description: `this will insert new ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `create new ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          appointmentTime: { type: 'string', format: 'date-time' },
          appointmentProvider: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
          appointmentService: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
          },
          isUrgent: { type: 'boolean', default: false },
          note: { type: 'string' },
          tenant: { type: 'string', format: 'uuid', description: 'tenant ID' },
        },
        required: [
          'name',
          'phone',
          'appointmentTime',
          'appointmentProvider',
          'appointmentService',
          'tenant',
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

  reSchedule: {
    schema: {
      description: `this will reschedule ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `reschedule ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'visit ID',
          },
          name: { type: 'string' },
          phone: { type: 'string' },
          appointmentTime: { type: 'string', format: 'date-time' },
          appointmentProvider: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
          appointmentService: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
          },
          isUrgent: { type: 'boolean', default: false },
          note: { type: 'string' },
          tenant: { type: 'string', format: 'uuid', description: 'tenant ID' },
        },
        required: [
          'appointmentId',
          'name',
          'phone',
          'appointmentTime',
          'appointmentProvider',
          'appointmentService',
          'tenant',
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

  find: {
    schema: {
      description: `this will find ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with find`,
      params: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'appointment ID',
          },
        },
        required: ['appointmentId'],
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
      tags: ['admin|Appointment'],
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

  lovService: {
    schema: {
      description: `this will lov services ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with lov services`,
      params: {
        type: 'object',
        properties: {
          providerId: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['providerId'],
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

  edit: {
    schema: {
      description: `this will edit ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with edit`,
      params: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'appointment ID',
          },
        },
        required: ['appointmentId'],
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

  provider: {
    schema: {
      description: `this will edit ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with edit`,
      params: {
        type: 'object',
        properties: {
          providerId: {
            type: 'string',
            format: 'uuid',
            description: 'appointment ID',
          },
        },
        required: ['providerId'],
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
      tags: ['admin|Appointment'],
      summary: `update ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'visit ID',
          },
          name: { type: 'string' },
          phone: { type: 'string' },
          appointmentProvider: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
          appointmentService: {
            type: 'array',
            items: {
              type: 'string',
              format: 'uuid',
            },
          },
          isUrgent: { type: 'boolean', default: false },
          note: { type: 'string' },
        },
        required: [
          'appointmentId',
          'name',
          'phone',
          'appointmentProvider',
          'appointmentService',
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

  cancel: {
    schema: {
      description: `this will cancel ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with cancel`,
      params: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'visit ID',
          },
        },
        required: ['appointmentId'],
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
      description: `this will cancel ${serviceName}`,
      tags: ['admin|Appointment'],
      summary: `${serviceName} with cancel`,
      params: {
        type: 'object',
        properties: {
          appointmentId: {
            type: 'string',
            format: 'uuid',
            description: 'visit ID',
          },
        },
        required: ['appointmentId'],
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
