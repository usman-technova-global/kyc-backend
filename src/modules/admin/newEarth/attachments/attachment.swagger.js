const swagger = {
  list: {
    schema: {
      description: 'this will list project attachments',
      tags: ['NewEarth|Project|Attachments'],
      summary: 'list project attachments',
      params: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            format: 'uuid',
          },
        },
        additionalProperties: false,
      },
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

  store: {
    schema: {
      description: 'this will create project attachment collection',
      tags: ['NewEarth|Project|Attachments'],
      summary: 'create new project attachment',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          file: { isFile: true },
          projectId: {
            type: 'string',
            format: 'uuid',
          },
          day: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
        },
        required: ['projectId', 'file', 'day', 'title', 'description'],
        // additionalProperties: false,
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
      description: 'this will update project video',
      tags: ['NewEarth|Project|Attachments'],
      summary: 'update project attachment',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          file: { isFile: true },
          projectId: {
            type: 'string',
            format: 'uuid',
          },
          day: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          category: {
            type: 'string',
          },
        },
        // additionalProperties: false,
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

  delete: {
    schema: {
      description: 'this will upload project plan',
      tags: ['NewEarth|Project|Attachments'],
      summary: 'delete new project attachment',
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
        },
        // additionalProperties: false,
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
