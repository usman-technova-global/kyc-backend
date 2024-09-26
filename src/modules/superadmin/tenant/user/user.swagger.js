const swagger = {
  list: {
    schema: {
      description: 'this will list tenant user user',
      tags: ['superAdmin|ShopUser'],
      summary: 'tenant User List',
      params: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            description: 'page number',
          },
          size: {
            type: 'integer',
            format: 'int32',
            default: 10,
            description: 'list size',
          },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      },
    },
  },

  search: {
    schema: {
      description: 'this will list tenant user user',
      tags: ['superAdmin|ShopUser'],
      summary: 'tenant User List',
      params: {
        type: 'object',
        properties: {
          search: {
            type: 'string',
            description: 'search',
          },
          page: {
            type: 'integer',
            format: 'int32',
            default: 0,
            description: 'page number',
          },
          size: {
            type: 'integer',
            format: 'int32',
            default: 10,
            description: 'list size',
          },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      },
    },
  },

  detail: {
    schema: {
      description: 'this will user detail',
      tags: ['superAdmin|ShopUser'],
      summary: 'User detail',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
          },
        },
        required: ['userId'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
