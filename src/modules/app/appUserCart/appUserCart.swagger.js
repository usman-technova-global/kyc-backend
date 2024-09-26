const swagger = {
  updateCart: {
    schema: {
      description: 'this will update user cart',
      tags: ['app|UserCart'],
      summary: 'update user cart',
      body: {
        type: 'object',
        properties: {
          cartId: { type: 'string', format: 'uuid' },
          appUser: { type: 'string', format: 'uuid', nullable: true },
          tenant: { type: 'string', format: 'uuid' },
          appUserDevice: { type: 'string', format: 'uuid' },
          appUserAddress: { type: 'string', format: 'uuid', nullable: true },
          pickupDateTime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
          dropDateTime: { type: 'string', format: 'date-time', nullable: true },
          voucherCode: { type: 'string' },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                quantity: { type: 'integer' },
              },
              required: ['id', 'quantity'],
              additionalProperties: false,
            },
          },
        },
        required: ['cartId', 'tenant', 'products'],
        additionalProperties: false,
      },
    },
  },

  getCartByUser: {
    schema: {
      description: 'this will get user cart by jwt',
      tags: ['app|UserCart'],
      summary: 'get user cart',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  getCartByDevice: {
    schema: {
      description: 'this will get device cart by device id',
      tags: ['app|UserCart'],
      summary: 'get device cart',
      body: {
        type: 'object',
        properties: {
          tenant: { type: 'string', format: 'uuid' },
          appUserDevice: { type: 'string', format: 'uuid' },
        },
        required: ['appUserDevice', 'tenant'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
