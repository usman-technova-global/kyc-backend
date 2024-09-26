const swagger = {
  listSwagger: {
    schema: {
      description: 'this will list app image',
      tags: ['superAdmin|AppImage'],
      summary: 'list app image',
      querystring: {
        page: { type: 'integer', minimum: 0 },
        size: { type: 'integer', minimum: 10 },
      },
    },
  },

  searchSwagger: {
    schema: {
      description: 'this will search app image',
      tags: ['superAdmin|AppImage'],
      summary: 'search app image',
      querystring: {
        search: { type: 'string' },
        page: { type: 'integer', minimum: 0 },
        size: { type: 'integer', minimum: 10 },
        additionalProperties: false,
      },
    },
  },

  editSwagger: {
    schema: {
      description: 'this will edit app image',
      tags: ['superAdmin|AppImage'],
      summary: 'edit app image',
    },
  },

  create: {
    schema: {
      description: 'this will create app image',
      tags: ['superAdmin|AppImage'],
      summary: 'create app image',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          desc: { type: 'string' },
          avatar: { isFile: true },
          createdBy: { type: 'string', format: 'uuid' },
        },
        required: ['name', 'avatar', 'createdBy'],
      },
    },
  },

  update: {
    schema: {
      description: 'this will update app image',
      tags: ['superAdmin|AppImage'],
      summary: 'update app image',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Id',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', default: '' },
          desc: { type: 'string' },
          avatar: { isFile: true },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['name', 'updatedBy'],
      },
    },
  },
};

module.exports = swagger;
