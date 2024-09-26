const swagger = {
  list: {
    schema: {
      description: 'this will find list appointments',
      tags: ['staffApp|Appointment'],
      summary: 'find list appointments',
      params: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
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
  today: {
    schema: {
      description: 'this will find today appointments',
      tags: ['staffApp|Appointment'],
      summary: 'find today appointments',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  done: {
    schema: {
      description: 'this will update status appointments',
      tags: ['staffApp|Appointment'],
      summary: 'update status appointments',
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
        properties: {},
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
