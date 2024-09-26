const swagger = {
  employeeLov: {
    schema: {
      description: 'this will find store employee',
      tags: ['app|Store|Appointment'],
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
    },
  },
  linedUp: {
    schema: {
      description: 'this will find lined up appointments',
      tags: ['app|Store|Appointment'],
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
    },
  },
  create: {
    schema: {
      description: 'this will create store appointment',
      tags: ['app|Store|Appointment'],
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
    },
  },
  pengCreate: {
    schema: {
      description: 'this will create store appointment',
      tags: ['app|Store|Appointment'],
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
                appointmentType: { type: 'string' },
              },
              required: [
                // 'storeEmployee',
                'storeServiceCategory',
                'storeServiceCategoryItem',
                'appointmentTime',
              ],
              additionalProperties: false,
            },
          },
          guest: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                appointments: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      storeEmployee: {
                        type: 'string',
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
                      appointmentType: { type: 'string' },
                    },
                    required: [
                      // 'storeEmployee',
                      'storeServiceCategory',
                      'storeServiceCategoryItem',
                      'appointmentTime',
                    ],
                    additionalProperties: false,
                  },
                },
              },
            },
          },
        },
        required: ['name', 'appointments'],
        additionalProperties: false,
      },
    },
  },
  allAppointments: {
    schema: {
      description: 'This will get all the appointments',
      tags: ['app|Store|Appointment'],
      summary: 'get the appointments',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        // required: ['Authorization'],
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
  getAppointment: {
    schema: {
      description: 'this will find appointment',
      tags: ['app|Store|Appointment'],
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

  reSchedule: {
    schema: {
      description: 'this will re-schedule store appointment',
      tags: ['app|Store|Appointment'],
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
};

module.exports = swagger;
