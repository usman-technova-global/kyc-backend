const swagger = {
  employeeLov: {
    schema: {
      description: 'this will find store employee',
      tags: ['peng|app|barbers'],
      summary: 'find barbers employee',
      body: {
        type: 'object',
        properties: {
          storeServiceCategoryItems: {
            type: 'array',
          },
        },
        required: ['storeServiceCategoryItems'],
      },
    },
  },
  linedUp: {
    schema: {
      description: 'this will find lined up appointments',
      tags: ['admin|Store|Appointment'],
      summary: 'find lined up appointments',
      body: {
        type: 'object',
        properties: {
          storeEmployees: {
            type: 'array',
          },
          linedUpDate: {
            type: 'string',
            format: 'date',
          },
        },
        required: ['storeEmployees', 'linedUpDate'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
