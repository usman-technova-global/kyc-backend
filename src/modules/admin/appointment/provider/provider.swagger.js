const swagger = {
  list: {
    schema: {
      description: 'this will list provider',
      tags: ['admin|Provider'],
      summary: 'provider with pagination',
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
            default: 2000,
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
      description: 'this will search provider',
      tags: ['admin|Provider'],
      summary: 'provider with search',
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
            default: 2000,
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
      description: 'this will insert new provider',
      tags: ['admin|Provider'],
      summary: 'create new provider',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          cnic: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          workDays: {
            type: 'array',
            items: {
              type: 'string',
              enum: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
              ],
            },
          },
          tenant: { type: 'string', format: 'uuid', description: 'tenant ID' },
          createdBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: [
          'name',
          'cnic',
          'phone',
          'address',
          'startTime',
          'endTime',
          'workDays',
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
      description: 'this will update provider',
      tags: ['admin|Provider'],
      summary: 'update new provider',
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
          cnic: { type: 'string' },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string' },
          address: { type: 'string' },
          urgentFee: { type: 'number', default: 0, minimum: 0 },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['name', 'cnic', 'phone', 'updatedBy'],
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
      description: 'this will find provider',
      tags: ['admin|Provider'],
      summary: 'find provider',
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

  findAppointmentByProviderId: {
    schema: {
      description: 'this will find provider by id into current date only',
      tags: ['admin|Provider'],
      summary: 'find provider by id',
      type: 'object',
      querystring: {
        search: { type: 'string' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
      },
      params: {
        type: 'object',
        properties: {
          providerId: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
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

  updateStatus: {
    schema: {
      description: 'this will status update  provider',
      tags: ['admin|Provider'],
      summary: 'status update provider',
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
      description: 'this will delete provider',
      tags: ['admin|Provider'],
      summary: 'delete provider',
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

  scheduleList: {
    schema: {
      description: 'this will list provider schedule',
      tags: ['admin|Provider'],
      summary: 'provider schedule with pagination',
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

  scheduleCreate: {
    schema: {
      description: 'this will insert new provider',
      tags: ['admin|Provider'],
      summary: 'create new provider',
      body: {
        type: 'object',
        properties: {
          workDays: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: {
                  type: 'string',
                  enum: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                  ],
                },
                startTime: { type: 'string', format: 'date-time' },
                endTime: { type: 'string', format: 'date-time' },
              },
              required: ['day', 'startTime', 'endTime'],
              additionalProperties: false,
            },
          },
          appointmentProvider: {
            type: 'string',
            format: 'uuid',
            description: 'provider ID',
          },
          createdBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['workDays', 'appointmentProvider', 'createdBy'],
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

  scheduleFind: {
    schema: {
      description: 'this will list provider schedule',
      tags: ['admin|Provider'],
      summary: 'provider schedule with pagination',
      params: {
        type: 'object',
        properties: {
          scheduleId: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['scheduleId'],
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

  scheduleUpdate: {
    schema: {
      description: 'this will insert new provider',
      tags: ['admin|Provider'],
      summary: 'create new provider',
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'schedule ID' },
          workDay: { type: 'string' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['id', 'workDay', 'startTime', 'endTime', 'updatedBy'],
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

  scheduleUpdateStatus: {
    schema: {
      description: 'this will insert new provider',
      tags: ['admin|Provider'],
      summary: 'create new provider',
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'schedule ID' },
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['id', 'isActive', 'updatedBy'],
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
