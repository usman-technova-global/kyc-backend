const serviceName = 'Appointment';

const swagger = {
  categoryList: {
    schema: {
      description: `this will category list ${serviceName}`,
      tags: ['app|AppointmentCategories'],
      summary: `${serviceName} category list`,
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
        page: { type: 'integer', format: 'int32', default: 0, minimum: 0 },
        size: { type: 'integer', format: 'int32', default: 10, minimum: 10 },
      },
      params: {
        tenant: { type: 'string', description: 'Tenant ID' },
      },
    },
  },
};

module.exports = swagger;
