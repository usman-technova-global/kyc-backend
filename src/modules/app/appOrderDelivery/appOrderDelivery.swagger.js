const swagger = {
  assignedOrders: {
    schema: {
      description: 'this will fetch assigned orders for driver',
      tags: ['app|OrderDelivery'],
      summary: 'fetch assigned orders',
      querystring: {
        offset: { type: 'integer', minimum: 0, default: 0 },
        limit: { type: 'integer', minimum: 10, default: 10 },
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

  assignedOrderDetails: {
    schema: {
      description: 'this will fetch assigned order details for driver',
      tags: ['app|OrderDelivery'],
      summary: 'fetch assigned order details',
      params: {
        type: 'object',
        properties: {
          orderId: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['orderId'],
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

  setOrderStatus: {
    schema: {
      description: 'this will set order status',
      tags: ['app|OrderDelivery'],
      summary: 'set order status',
      body: {
        type: 'object',
        properties: {
          appOrderDelivery: { type: 'string', format: 'uuid' },
          status: {
            type: 'string',
            enum: [
              'Driver-Accepted-To-Pick-Up-Item-From-Customer',
              'Driver-Picked-Up-Item-From-Customer',
              'Driver-Declined-To-Pickup-Item-From-Customer',
              'Driver-Returned-Item-To-Customer',
              'Driver-Accepted-To-Pick-Up-Item-From-Shop',
              'Driver-Picked-Up-Item-From-Shop',
              'Driver-Delivered-Item-To-Customer',
              'Driver-Declined-To-Pickup-Item-From-Shop',
              'Driver-Returned-Item-To-Shop',
              'Driver-Delivered-Item-To-Shop',
            ],
          },
        },
        required: ['status', 'appOrderDelivery'],
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
