const swagger = {
  create: {
    schema: {
      description: ` this will status update`,
      tags: ['app|Order'],
      summary: `status update`,
      body: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: [
              'New',
              'Driver-Assigned-For-Item-Pickup',
              'Driver-Accepted-To-Pick-Up-Item-From-Customer',
              'Driver-Picked-Up-Item-From-Customer',
              'Driver-Delivered-Item-To-Shop',
              'Driver-Declined-To-Pickup-Item-From-Customer',
              'Driver-Returned-Item-To-Customer',
              'Processing-Item',
              'Driver-Assigned-For-Item-Delivery',
              'Driver-Accepted-To-Pick-Up-Item-From-Shop',
              'Driver-Picked-Up-Item-From-Shop',
              'Driver-Delivered-Item-To-Customer',
              'Driver-Declined-To-Pickup-Item-From-Shop',
              'Driver-Returned-Item-To-Shop',
              'Customer-Pick-Up',
              'Completed',
              'Cancelled',
            ],
          },
          app_order: { type: 'string', format: 'uuid' },
        },
        required: ['status', 'app_order'],
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
