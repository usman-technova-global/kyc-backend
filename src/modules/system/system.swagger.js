const swagger = {
  get: {
    schema: {
      description: 'this will get System Config',
      tags: ['systemConfig'],
      summary: 'System Config get',
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
    },
  },
  getDomain: {
    schema: {
      description: 'this will get System Config',
      tags: ['systemConfig'],
      summary: 'System Config get',
      params: {
        type: 'object',
        properties: {
          domain: {
            type: 'string',
          },
        },
        required: ['domain'],
        additionalProperties: false,
      },
    },
  },
  defaultTheme: {
    schema: { hide: true },
  },
  detail: {
    schema: {
      description: 'this will get detail of System Config',
      tags: ['systemConfig'],
      summary: 'System Config Detail',
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
    },
  },
  colorChange: {
    schema: {
      description: 'this will System Config Update',
      tags: ['systemConfig'],
      summary: 'System Config Update',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          theme: {
            type: 'string',
            format: 'uuid',
          },
          updatedBy: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['theme', 'updatedBy'],
        additionalProperties: false,
      },
    },
  },
  layoutUpdate: {
    schema: {
      description: 'this will system config update',
      tags: ['systemConfig'],
      summary: 'System Config Update',
      consumes: ['multipart/form-data'],
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['tenant'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          logoffImage: { isFile: true },
        },
        required: ['logoffImage'],
        additionalProperties: false,
      },
    },
  },
};

module.exports = swagger;
