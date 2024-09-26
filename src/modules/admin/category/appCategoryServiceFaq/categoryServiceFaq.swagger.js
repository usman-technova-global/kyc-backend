const swagger = {
  list: {
    schema: {
      description: 'this will pagination list',
      tags: ['admin|CategoryServiceFaq'],
      summary: 'pagination list',
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
          },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['categoryServiceId', 'page', 'size'],
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
      tags: ['admin|CategoryServiceFaq'],
      summary: 'pagination search',
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
          },
          search: { type: 'string' },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['categoryServiceId', 'page', 'size'],
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
      tags: ['admin|CategoryServiceFaq'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
          categoryServiceFaqId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['categoryServiceFaqId'],
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
      description: 'this will update category status',
      tags: ['admin|CategoryServiceFaq'],
      summary: 'update category status',
      params: {
        type: 'object',
        properties: {
          categoryServiceId: {
            type: 'string',
            format: 'uuid',
            description: 'Id',
          },
        },
        required: ['categoryServiceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          created_by: {
            type: 'string',
            format: 'uuid',
          },
          updated_by: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['question', 'answer', 'created_by'],
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
      description: 'this will update category status',
      tags: ['admin|CategoryServiceFaq'],
      summary: 'update category status',
      params: {
        type: 'object',
        properties: {
          categoryServiceFaqId: {
            type: 'string',
            format: 'uuid',
            description: 'Id',
          },
        },
        required: ['categoryServiceFaqId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          updated_by: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['question', 'answer', 'updated_by'],
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
      description: 'this will update category status',
      tags: ['admin|CategoryServiceFaq'],
      summary: 'update category status',
      params: {
        type: 'object',
        properties: {
          categoryServiceFaqId: {
            type: 'string',
            format: 'uuid',
            description: 'Id',
          },
        },
        required: ['categoryServiceFaqId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          is_active: {
            type: 'boolean',
          },
          updated_by: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['is_active'],
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
      description: 'this will delete category',
      tags: ['admin|CategoryServiceFaq'],
      summary: 'delete category status',
      params: {
        type: 'object',
        properties: {
          categoryServiceFaqId: {
            type: 'string',
            format: 'uuid',
            description: 'Id',
          },
        },
        required: ['categoryServiceFaqId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          is_active: {
            type: 'boolean',
          },
          is_deleted: {
            type: 'boolean',
          },
          updated_by: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['is_active', 'is_deleted'],
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
