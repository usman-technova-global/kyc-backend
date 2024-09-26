const swagger = {
  getCartByUser: {
    schema: {
      description: 'this will get user cart by jwt',
      tags: ['admin|AppOrder'],
      summary: 'get user cart',
      body: {
        type: 'object',
        properties: {
          tenant: { type: 'string', format: 'uuid', description: 'tenant ID' },
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'app user ID',
          },
        },
        required: ['tenant', 'appUser'],
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

  categoryList: {
    schema: {
      description: 'this will list category',
      tags: ['admin|OrderPlace'],
      summary: 'list category',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
          },
        },
        required: ['tenant'],
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

  catItemList: {
    schema: {
      description: 'this will list category item',
      tags: ['admin|OrderPlace'],
      summary: 'list category item',
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            description: 'Category ID',
          },
        },
        required: ['categoryId'],
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

  updateCart: {
    schema: {
      description: 'this will update user cart',
      tags: ['admin|OrderPlace'],
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
          voucherCode: { type: 'string', default: 'urapp23' },
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  newOrder: {
    schema: {
      description: 'this will place user order',
      tags: ['admin|OrderPlace'],
      summary: 'place user order',
      body: {
        type: 'object',
        properties: {
          cartId: { type: 'string', format: 'uuid', description: 'Cart ID' },
          fulfillmentMethod: {
            type: 'string',
            enum: ['Delivery', 'Self'],
            default: 'Self',
          },
          tenant: { type: 'string', format: 'uuid', description: 'Tenant ID' },
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'App Uer ID',
          },
        },
        required: ['cartId', 'tenant', 'appUser'],
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
