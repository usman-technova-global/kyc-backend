const swagger = {
  weekly: {
    schema: {
      description: 'this will find weekly appointments',
      tags: ['admin|Store|Appointment'],
      summary: 'find weekly appointments',
      params: {
        type: 'object',
        properties: {
          week: {
            type: 'integer',
            format: 'int32',
          },
          storeEmployee: {
            type: 'string',
            anyOf: [{ format: 'uuid' }, { minLength: 0 }],
          },
        },
        required: ['week'],
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
  distinctWeekly: {
    schema: {
      description: 'this will find weekly appointments',
      tags: ['admin|Store|Appointment'],
      summary: 'find weekly appointments',
      params: {
        type: 'object',
        properties: {
          week: {
            type: 'integer',
            format: 'int32',
          },
          storeEmployee: {
            type: 'string',
            anyOf: [{ format: 'uuid' }, { minLength: 0 }],
          },
        },
        required: ['week'],
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
  monthly: {
    schema: {
      description: 'this will find monthly appointments',
      tags: ['admin|Store|Appointment'],
      summary: 'find monthly appointments',
      params: {
        type: 'object',
        properties: {
          month: {
            type: 'string',
            format: 'date',
          },
          storeEmployee: {
            type: 'string',
            anyOf: [{ format: 'uuid' }, { minLength: 0 }],
          },
        },
        required: ['month'],
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
  distinctMonthly: {
    schema: {
      description: 'this will find monthly appointments',
      tags: ['admin|Store|Appointment'],
      summary: 'find monthly appointments',
      params: {
        type: 'object',
        properties: {
          month: {
            type: 'string',
            format: 'date',
          },
          storeEmployee: {
            type: 'string',
            anyOf: [{ format: 'uuid' }, { minLength: 0 }],
          },
        },
        required: ['month'],
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
  getAppointment: {
    schema: {
      description: 'this will find appointment',
      tags: ['admin|Store|Appointment'],
      summary: 'find appointment',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  getAppointmentByCode: {
    schema: {
      description: 'this will find appointment',
      tags: ['admin|Store|Appointment'],
      summary: 'find appointment',
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
        },
        required: ['code'],
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
  employeeLov: {
    schema: {
      description: 'this will find store employee',
      tags: ['admin|Store|Appointment'],
      summary: 'find store employee',
      params: {
        type: 'object',
        properties: {
          storeServiceCategoryItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['storeServiceCategoryItem'],
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
      tags: ['admin|Store|Appointment'],
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
  create: {
    schema: {
      description: 'this will create store appointment',
      tags: ['admin|Store|Appointment'],
      summary: 'create store appointment',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          appUser: { type: 'string', format: 'uuid' },
          gender: { type: 'string' },
          note: { type: 'string' },
          status: { type: 'string', enum: ['Processing', 'New'] },
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
  individualReSchedule: {
    schema: {
      description: 'this will re-schedule store appointment',
      tags: ['admin|Store|Appointment'],
      summary: 're-schedule store appointment',
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
          appointmentTime: { type: 'string', format: 'date-time' },
        },
        required: ['appointmentTime'],
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
      tags: ['admin|Store|Appointment'],
      summary: 'create store appointment',
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
        },
        required: ['code'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          appUser: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
          gender: { type: 'string' },
          note: { type: 'string' },
          status: { type: 'string', enum: ['Processing', 'New'] },
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
  update: {
    schema: {
      description: 'this will update store appointment',
      tags: ['admin|Store|Appointment'],
      summary: 'update store appointment',
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
        },
        required: ['name'],
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
      description: 'this will status update store appointment',
      tags: ['admin|Store|Appointment'],
      summary: 'status update store appointment',
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
          status: {
            type: 'string',
            enum: ['Cancelled', 'Completed', 'Done', 'Processing'],
          },
        },
        required: ['status'],
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
  serviceDetail: {
    schema: {
      description: 'this will find store employee',
      tags: ['admin|Store|Appointment'],
      summary: 'find store employee',
      params: {
        type: 'object',
        properties: {
          storeEmployee: {
            type: 'string',
            format: 'uuid',
          },
          storeServiceCategoryItem: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['storeEmployee', 'storeServiceCategoryItem'],
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
  // servicePaid: {
  //   schema: {
  //     description: 'this will paid store service',
  //     tags: ['admin|Store|Appointment'],
  //     summary: 'paid store service',
  //     params: {
  //       type: 'object',
  //       properties: {
  //         storeAppointment: {
  //           type: 'string',
  //           format: 'uuid',
  //         },
  //       },
  //       required: ['storeAppointment'],
  //       additionalProperties: false,
  //     },
  //     headers: {
  //       type: 'object',
  //       properties: {
  //         Authorization: { type: 'string' },
  //       },
  //       required: ['Authorization'],
  //     },
  //   },
  // },
  serviceDone: {
    schema: {
      description: 'this will done store service',
      tags: ['admin|Store|Appointment'],
      summary: 'done store service',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  servicePaid: {
    schema: {
      description: 'this will paid store service',
      tags: ['admin|Store|Appointment'],
      summary: 'paid store service',
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
        },
        required: ['code'],
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
  allServicesCancell: {
    schema: {
      description: 'this will cancell store service',
      tags: ['admin|Store|Appointment'],
      summary: 'cancell store service',
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
        },
        required: ['code'],
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
  serviceCancell: {
    schema: {
      description: 'this will cancell store service',
      tags: ['admin|Store|Appointment'],
      summary: 'cancell store service',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  allAppointments: {
    schema: {
      description: 'This will get all the appointments',
      tags: ['adminStoreAppointment'],
      summary: 'get the appointments',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      querystring: {
        startDate: {
          type: 'string',
        },
        endDate: {
          type: 'string',
        },
      },
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID.',
          },
          startDate: {
            type: 'string',
            format: 'date',
            description: 'Start Date.',
          },
          endDate: {
            type: 'string',
            format: 'date',
            description: 'End Date.',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
    },
  },
  serviceProcessing: {
    schema: {
      description: 'this will processing store service',
      tags: ['admin|Store|Appointment'],
      summary: 'processing store service',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  appointmentInvoice: {
    schema: {
      description: 'this will get appointment invoice',
      tags: ['admin|Store|Appointment'],
      summary: 'get appointment invoice',
      params: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
        },
        required: ['code'],
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
  appointmentInvoiceByStatusDone: {
    schema: {
      description: 'this will get appointment invoice',
      tags: ['admin|Store|Appointment'],
      summary: 'get appointment invoice',
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
