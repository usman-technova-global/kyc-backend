const swagger = {
  promotion: {
    schema: {
      description: 'this will list of promotions',
      tags: ['app|Voucher'],
      summary: 'List of promotions',
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
