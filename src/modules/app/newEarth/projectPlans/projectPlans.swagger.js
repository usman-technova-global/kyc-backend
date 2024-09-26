const swagger = {
  list: {
    schema: {
      description: 'this will list store employee',
      tags: ['New Earth|Project|Plans'],
      summary: 'list project plan',
      params: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['projectId'],
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
  listLOV: {
    schema: {
      description: 'this will list store employee',
      tags: ['New Earth|Project|Plans'],
      summary: 'list project plan',
      params: {
        type: 'object',
        properties: {
          projectId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['projectId'],
        additionalProperties: false,
      },
      querystring: {
        search: { type: 'string', description: 'text to filter list' },
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

  uploadFile: {
    schema: {
      description: 'this will upload project plan',
      tags: ['NewEarth|Project|Plans'],
      summary: 'create new project plan',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          tenantId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenantId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          planFile: { isFile: true },
          projectId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['projectId', 'planFile'],
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
  updatePlans: {
    schema: {
      description: 'this will upload and edit project plan',
      tags: ['NewEarth|Project|Plans'],
      summary: 'create new project plan',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          tenantId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenantId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          planFile: { isFile: true },
          projectId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['projectId', 'planFile'],
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
