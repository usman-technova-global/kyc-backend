const serviceName = 'service';

const swagger = {
  categoryList: {
    schema: {
      description: `this will category list ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} category list`,
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
        page: { type: 'integer', format: 'int32', default: 0, minimum: 0 },
        size: { type: 'integer', format: 'int32', default: 10, minimum: 10 },
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
  categoryCreate: {
    schema: {
      description: `this will create category ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} create category`,
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          description: { type: 'string' },
          avatar: { isFile: true },
        },
        required: ['name', 'avatar'],
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
  categoryUpdate: {
    schema: {
      description: `this will update category ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} update category`,
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          description: { type: 'string' },
          avatar: { isFile: true },
        },
        required: ['name'],
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
  categoryUpdateStatus: {
    schema: {
      description: `this will update status category ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} update status category`,
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean', default: false },
        },
        required: ['isActive'],
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
  categoryDelete: {
    schema: {
      description: `this will delete category ${serviceName}`,
      tags: ['adminStoreService'],
      summary: `${serviceName} delete category`,
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isDeleted: { type: 'boolean', default: false },
        },
        required: ['isDeleted'],
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

  categoryLov: {
    schema: {
      description: `this will category lov ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} category lov`,
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  categoryItemList: {
    schema: {
      description: `this will category item list ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} category item list`,
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
        page: { type: 'integer', format: 'int32', default: 0, minimum: 0 },
        size: { type: 'integer', format: 'int32', default: 10, minimum: 10 },
      },
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
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
  categoryItemCreate: {
    schema: {
      description: `this will create category item ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} create category item`,
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          price: { type: 'integer' },
          description: { type: 'string' },
          avatar: { isFile: true },
          serviceTime: { type: 'integer', format: 'int32', default: 0 },
          storeServiceCategory: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['name', 'price', 'avatar', 'storeServiceCategory'],
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
  categoryItemUpdate: {
    schema: {
      description: `this will update category item ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} update category item`,
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryItemId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryItemId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          price: { type: 'integer' },
          description: { type: 'string' },
          serviceTime: { type: 'integer', format: 'int32', default: 0 },
          avatar: { isFile: true },
        },
        required: ['name', 'price'],
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
  categoryItemUpdateStatus: {
    schema: {
      description: `this will update category status ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} update category status`,
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          categoryItemId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryItemId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean', default: false },
        },
        required: ['isActive'],
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
  categoryItemDelete: {
    schema: {
      description: `this will delete category item ${serviceName}`,
      tags: ['adminStoreService'],
      summary: `${serviceName} delete category item`,
      params: {
        type: 'object',
        properties: {
          categoryItemId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryItemId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isDeleted: { type: 'boolean', default: false },
        },
        required: ['isDeleted'],
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

  categoryItemLov: {
    schema: {
      description: `this will category item lov ${serviceName}`,
      tags: ['admin|Store|Service'],
      summary: `${serviceName} category item lov`,
      params: {
        type: 'object',
        properties: {
          categoryId: {
            type: 'string',
            format: 'uuid',
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
};

module.exports = swagger;
