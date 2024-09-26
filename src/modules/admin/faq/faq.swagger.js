const swagger = {
  list: {
    schema: {
      description: 'this will list faq',
      tags: ['admin|Faq'],
      summary: 'faq list',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
      },
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
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
      description: 'this will create faq',
      tags: ['admin|Faq'],
      summary: 'faq create',
      body: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          tenant: { type: 'string', format: 'uuid' },
          createdBy: { type: 'string', format: 'uuid' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['question', 'answer', 'tenant', 'createdBy', 'updatedBy'],
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

  find: {
    schema: {
      description: `this will find faq`,
      tags: ['admin|Faq'],
      summary: `faq find`,
      params: {
        type: 'object',
        properties: {
          faqId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['faqId'],
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
      description: 'this will update faq',
      tags: ['admin|Faq'],
      summary: 'faq update',
      params: {
        type: 'object',
        properties: {
          faqId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['faqId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          question: { type: 'string' },
          answer: { type: 'string' },
          tenant: { type: 'string', format: 'uuid' },
          createdBy: { type: 'string', format: 'uuid' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['question', 'answer', 'createdBy', 'updatedBy'],
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
      description: `this will update status of faq`,
      tags: ['admin|Faq'],
      summary: `status update`,
      params: {
        type: 'object',
        properties: {
          faqId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['faqId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['isActive'],
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
