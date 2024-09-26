const swagger = {
  get: {
    schema: {
      description: 'this will list',
      tags: ['admin|ShopSchedule'],
      summary: 'List',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          date: {
            type: 'string',
            format: 'date',
          },
        },
        required: ['tenant', 'date'],
        additionalProperties: false,
      },
    },
  },
  update: {
    schema: {
      type: 'object',
      description: 'This will set Shop Timing and off Days.',
      tags: ['admin|ShopSchedule'],
      summary: 'Set Shop Timing and off Days.',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID.',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date',
            description: 'Date.',
          },
          workDays: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: {
                  type: 'string',
                  enum: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ],
                  description: 'Day of the week.',
                },
                breakTime: {
                  type: 'string',
                  description: 'Break start time.',
                },
                breakOffTime: {
                  type: 'string',
                  description: 'Break end time.',
                },
                openTime: {
                  type: 'string',
                  description: 'Opening time.',
                },
                closeTime: {
                  type: 'string',
                  description: 'Closing time.',
                },
              },
            },
            description: 'Array of work days.',
          },
          eventDays: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                event: {
                  type: 'string',
                  description: 'Event ID.',
                },
                startDate: {
                  type: 'string',
                  format: 'date',
                  description: 'Start date of the event.',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  description: 'End date of the event.',
                },
              },
            },
            description: 'Array of event days.',
          },
        },
        required: ['date'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
