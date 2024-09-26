const swagger = {
  addUserAddress: {
    schema: {
      description: 'this will add user address',
      tags: ['app|UserAddress'],
      summary: 'add user address',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          address: { type: 'string' },
          type: { type: 'string', enum: ['Home', 'Office', 'Other'] },
          latitude: { type: 'number', format: 'float' },
          longitude: { type: 'number', format: 'float' },
        },
        required: ['name', 'address', 'type', 'latitude', 'longitude'],
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

  litsUserAddress: {
    schema: {
      description: 'List all the addresses of the user',
      tags: ['app|UserAddress'],
      summary: 'List User Address',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  updateStatusUserAddress: {
    schema: {
      description: 'this will update user address status',
      tags: ['app|UserAddress'],
      summary: 'update user address status',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
        id: { type: 'string', format: 'uuid' },
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

  deleteUserAddress: {
    schema: {
      description: 'this will delete user address',
      tags: ['app|UserAddress'],
      summary: 'delete user address',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
        id: { type: 'string', format: 'uuid' },
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
