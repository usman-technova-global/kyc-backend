const serviceName = 'appointment';

const swagger = {
  list: {
    schema: {
      description: `this will list ${serviceName}`,
      tags: ['app|Appointment'],
      summary: `${serviceName} with pagination`,
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
      tags: ['app|Appointment'],
      summary: `${serviceName} with search`,
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
      description: 'this will create store appointment',
      tags: ['app|Appointment'],
      summary: 'create store appointment',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          gender: { type: 'string' },
          note: { type: 'string' },
          appointments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                storeEmployee: {
                  type: 'string',
                  format: 'uuid',
                },
                storeServiceCategory: {
                  type: 'string',
                  format: 'uuid',
                },
                storeServiceCategoryItem: {
                  type: 'string',
                  format: 'uuid',
                },
                appointmentTime: { type: 'string', format: 'date-time' },
              },
              required: [
                'storeEmployee',
                'storeServiceCategory',
                'storeServiceCategoryItem',
                'appointmentTime',
              ],
              additionalProperties: false,
            },
          },
        },
        required: ['name', 'appointments'],
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
      description: 'this will create store appointment',
      tags: ['app|Appointment'],
      summary: 'create store appointment',
      params: {
        type: 'object',
        properties: {
          storeAppointment: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['storeAppointment'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          gender: { type: 'string' },
          note: { type: 'string' },
          appointments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                storeEmployee: {
                  type: 'string',
                  format: 'uuid',
                },
                storeServiceCategory: {
                  type: 'string',
                  format: 'uuid',
                },
                storeServiceCategoryItem: {
                  type: 'string',
                  format: 'uuid',
                },
                appointmentTime: { type: 'string', format: 'date-time' },
              },
              required: [
                'storeEmployee',
                'storeServiceCategory',
                'storeServiceCategoryItem',
                'appointmentTime',
              ],
              additionalProperties: false,
            },
          },
        },
        required: ['name', 'appointments'],
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
      tags: ['app|Appointment'],
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
      tags: ['app|Appointment'],
      summary: `${serviceName} with lov providers`,
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
      tags: ['app|Appointment'],
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
      tags: ['app|Appointment'],
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
      tags: ['app|Appointment'],
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
      tags: ['app|Appointment'],
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
      tags: ['app|Appointment'],
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
      tags: ['app|Appointment'],
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

  categories: {
    schema: {
      description: `this will list all appointment service categories`,
      tags: ['app|Appointment'],
      summary: `list all appointment service categories`,
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  categoryItems: {
    schema: {
      description: `this will all category items`,
      tags: ['app|Appointment'],
      summary: `this will all category items`,
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
        page: { type: 'integer', format: 'int32', default: 0, minimum: 0 },
        size: { type: 'integer', format: 'int32', default: 10, minimum: 10 },
      },
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
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
  serviceCategoryItem: {
    schema: {
      description: `this will all category items`,
      tags: ['app|Appointment'],
      summary: `this will all category items`,
      querystring: {
        tenant: { type: 'string', format: 'uuid' },
      },
      params: {
        type: 'object',
        properties: {
          categoryItemId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryItemId'],
        additionalProperties: false,
      },
    },
  },

  serviceProviders: {
    schema: {
      description: 'this will find service providers',
      tags: ['app|Appointment'],
      summary: 'find service providers',
      params: {
        type: 'object',
        properties: {
          categoryItemId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryItemId'],
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
  linedUp: {
    schema: {
      description: 'this will find lined up appointments',
      tags: ['app|Appointment'],
      summary: 'find lined up appointments',
      params: {
        type: 'object',
        properties: {
          storeEmployee: {
            type: 'string',
            format: 'uuid',
          },
          linedUpDate: {
            type: 'string',
            format: 'date',
          },
        },
        required: ['storeEmployee', 'linedUpDate'],
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

  ratinglist: {
    schema: {
      description: `this will fetch ${serviceName} ratinglist `,
      tags: ['app|Appointment'],
      summary: `fetch ${serviceName} ratinglist`,
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  rating: {
    schema: {
      description: `this will add ${serviceName} rating `,
      tags: ['app|Appointment'],
      summary: `add ${serviceName} rating`,
      params: {
        type: 'object',
        properties: {
          storeEmployeeRating: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['storeEmployeeRating'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          star: { type: 'integer', format: 'int32', default: 0 },
          review: { type: 'string', default: null },
          status: { type: 'string', enum: ['Leave', 'Completed'] },
        },
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
  leaveManagement: {
    schema: {
      description: 'this will list employee leave',
      tags: ['app|Appointment'],
      summary: 'employee leave list fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
          date: { type: 'string', format: 'date' },
        },
        required: ['employeeId', 'date'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        // required: ['Authorization'],
      },
    },
  },
  leaveManagementForEmployees: {
    schema: {
      description: 'this will list employee leave',
      tags: ['app|Appointment'],
      summary: 'employee leave list fetched',
      params: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date' },
        },
        required: ['date'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'array',
          },
        },
        required: ['employeeId'],
        additionalProperties: false,
      },
    },
  },
  appointmentUsers: {
    schema: {
      description: 'this will list user',
      tags: ['app|Appointment'],
      summary: 'user list fetched',
      params: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date',
          },
        },
        required: ['date'],
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
  userAppointmentsByDates: {
    schema: {
      description: 'this will list user appointments for dates',
      tags: ['app|Appointment|Dates'],
      summary: 'user list fetched',
      body: {
        type: 'object',
        properties: {
          dates: {
            type: 'array',
            items: {
              type: 'string',
              format: 'date',
            },
          },
        },
        required: ['dates'],
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
  getPayfastAccessToken: {
    schema: {
      description: 'this will return payfast access token',
      tags: ['app|Order'],
      summary: 'payfast access token',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        // required: ['Authorization'],
      },
    },
  },
  orderStatusUpdate: { schema: { hide: true } },
};

module.exports = swagger;
