const serviceName = 'Category Service';

const swagger = {
  list: {
    schema: {
      description: 'this will pagination list',
      tags: ['admin|CategoryService'],
      summary: 'pagination list',
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
          },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['categoryId', 'page', 'size'],
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
  search: {
    schema: {
      description: 'this will pagination search',
      tags: ['admin|CategoryService'],
      summary: 'pagination search',
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
          },
          search: { type: 'string' },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['categoryId', 'page', 'size'],
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
  get: {
    schema: {
      description: 'this will edit',
      tags: ['admin|CategoryService'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryServiceId'],
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
  updateStatus: {
    schema: {
      description: `this will status update ${serviceName}`,
      tags: ['admin|CategoryService'],
      summary: `status update ${serviceName}`,
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['categoryServiceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
          updatedBy: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
          },
        },
        required: ['isActive', 'updatedBy'],
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

  remove: {
    schema: {
      description: `this will status update ${serviceName}`,
      tags: ['admin|CategoryService'],
      summary: `status update ${serviceName}`,
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['categoryServiceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          updatedBy: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
          },
        },
        required: ['updatedBy'],
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

  create: {
    schema: {
      description: `this will create ${serviceName}`,
      tags: ['admin|CategoryService'],
      summary: `create ${serviceName}`,
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          price: { type: 'integer' },
          desc: { type: 'string' },
          icon: { isFile: true },
          loyaltyCoins: { type: 'number', default: 0 },
          createdBy: { type: 'string', format: 'uuid' },
        },
        required: ['name', 'price', 'createdBy'],
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

  update: {
    schema: {
      description: `this will update ${serviceName}`,
      tags: ['admin|CategoryService'],
      summary: `update ${serviceName}`,
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['categoryServiceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          price: { type: 'integer' },
          desc: { type: 'string' },
          icon: { isFile: true },
          loyaltyCoins: { type: 'number', default: 0 },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['name', 'price', 'updatedBy'],
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
