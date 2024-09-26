const swagger = {
  getEmployeeRating: {
    schema: {
      description: 'this will get employee rating',
      tags: ['app|getEmployeeRating'],
      summary: 'employee rating',
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string' },
        },
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
  updateEmployeeRating: {
    schema: {
      description: 'this will update employee rating',
      tags: ['app|updateEmployeeRating'],
      summary: 'employee rating',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
        },
        required: ['id'],
      },
      body: {
        type: 'object',
        properties: {
          star: { type: 'integer', format: 'int32', default: 0 },
          review: { type: 'string', default: null },
          status: { type: 'string', enum: ['Leave', 'Completed'] },
        },
        required: ['review', 'status', 'star'],
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
