const swagger = {
  list: {
    schema: {
      description: 'this will list banner',
      tags: ['admin|Banner'],
      summary: 'banner list',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
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

  create: {
    schema: {
      description: 'this will create banner',
      tags: ['admin|Banner'],
      summary: 'create banner',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          link: { type: 'string', default: '' },
          shortDesc: { type: 'string', default: '' },
          pageDetail: { type: 'string', default: '' },
          bannerType: { type: 'string', enum: ['Splash', 'Slider', 'Onboard'] },
          banner: { isFile: true },
          tenant: { type: 'string', format: 'uuid' },
          createdBy: { type: 'string', format: 'uuid' },
        },
        required: ['banner', 'bannerType', 'tenant', 'createdBy'],
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
      description: 'this will create banner',
      tags: ['admin|Banner'],
      summary: 'create banner',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          bannerId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['bannerId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          link: { type: 'string', default: '' },
          shortDesc: { type: 'string', default: '' },
          pageDetail: { type: 'string', default: '' },
          bannerType: { type: 'string', enum: ['Splash', 'Slider', 'Onboard'] },
          banner: { isFile: true },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['bannerType', 'updatedBy'],
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
      description: 'this will find banner',
      tags: ['admin|Banner'],
      summary: 'banner find',
      params: {
        type: 'object',
        properties: {
          bannerId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['bannerId'],
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
      description: 'this will update status banner',
      tags: ['admin|Banner'],
      summary: 'banner update status',
      params: {
        type: 'object',
        properties: {
          bannerId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['bannerId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['isActive', 'updatedBy'],
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

  deleteBanner: {
    schema: {
      description: 'this will delete banner',
      tags: ['admin|Banner'],
      summary: 'banner delete',
      params: {
        type: 'object',
        properties: {
          bannerId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['bannerId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['updatedBy'],
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
