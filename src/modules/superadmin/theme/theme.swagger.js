const serviceName = 'theme';
const swagger = {
  list: {
    schema: {
      description: `this will list ${serviceName}`,
      tags: ['superAdmin|theme'],
      summary: `${serviceName} with pagination`,
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
      description: `this will list ${serviceName}`,
      tags: ['superAdmin|theme'],
      summary: `${serviceName} with pagination`,
      params: {
        type: 'object',
        properties: {
          search: {
            type: 'string',
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
        required: ['search', 'page', 'size'],
        additionalProperties: false,
      },
    },
  },
  create: {
    schema: {
      description: `this will create ${serviceName}`,
      tags: ['superAdmin|theme'],
      summary: `${serviceName} creation`,
      body: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: {
            type: 'object',
            properties: {
              themeColor: {
                type: 'object',
                properties: {
                  primary: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  background: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  foreground: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  secondary: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  faded: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  secondary2: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                },
                required: [
                  'primary',
                  'background',
                  'foreground',
                  'secondary',
                  'faded',
                ],
                additionalProperties: false,
              },
              categoryColor: {
                type: 'array',
                items: {
                  type: 'string',
                  minLength: 4,
                  maxLength: 7,
                },
              },
            },
            required: ['themeColor', 'categoryColor'],
            additionalProperties: false,
          },
        },
        required: ['key', 'value'],
        additionalProperties: false,
      },
    },
  },
  update: {
    schema: {
      description: `this will update ${serviceName}`,
      tags: ['superAdmin|theme'],
      summary: `${serviceName} updation`,
      params: {
        themeId: { type: 'string', format: 'uuid' },
      },
      body: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: {
            type: 'object',
            properties: {
              themeColor: {
                type: 'object',
                properties: {
                  primary: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  background: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  foreground: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  secondary: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  faded: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                  secondary2: {
                    type: 'string',
                    minLength: 4,
                    maxLength: 7,
                  },
                },
                required: [
                  'primary',
                  'background',
                  'foreground',
                  'secondary',
                  'faded',
                ],
                additionalProperties: false,
              },
              categoryColor: {
                type: 'array',
                items: {
                  type: 'string',
                  minLength: 4,
                  maxLength: 7,
                },
              },
            },
            required: ['themeColor', 'categoryColor'],
            additionalProperties: false,
          },
        },
        required: ['key', 'value'],
        additionalProperties: false,
      },
    },
  },
  find: {
    schema: {
      description: `this will find ${serviceName}`,
      tags: ['superAdmin|theme'],
      summary: `${serviceName} find`,
      params: {
        type: 'object',
        properties: {
          themeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['themeId'],
        additionalProperties: false,
      },
    },
  },
  lovlist: { schema: { hide: true } },
};

module.exports = swagger;
