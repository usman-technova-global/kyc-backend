const swagger = {
  create: {
    schema: {
      description: 'this will place user order',
      tags: ['Admin|Role'],
      summary: 'place user order',
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", "description": "Identifier for the object" },
                      status: { type: "boolean", "description": "Status of the object" }
                    },
                    required: ["id", "status"]
                  }
                }
              },
              required: ["data"]
            }
          }
        },
        required: ['name', 'desc'],
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
      description: `this will status update`,
      tags: ['Admin|Role'],
      summary: `status update`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          desc: { type: 'string' },
          data: { type: 'array' },
        },
        required: ['name', 'desc'],
        additionalProperties: false,
      },
    },
  },

  updateStatus: {
    schema: {
      description: `this will status update`,
      tags: ['Admin|Role'],
      summary: `status update`,
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          is_active: { type: 'boolean' },
          updated_by: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
          },
        },
        required: ['is_active', 'updated_by'],
        additionalProperties: false,
      },
    },
  },
  list: {
    schema: {
      description: 'this will pagination list',
      tags: ['Admin|Role'],
      summary: 'pagination list',
      params: {
        type: 'object',
        properties: {
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['page', 'size'],
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
      tags: ['Admin|Role'],
      summary: 'pagination search',
      params: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      },
    },
  },
  getPermissions: {
    schema: { hide: true },
  },
  permission: {
    schema: {
      description: 'this will edit',
      tags: ['Admin|Role'],
      summary: 'edit',
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
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  getPermissions: {
    schema: {
      description: 'this will edit',
      tags: ['Admin|Role'],
      summary: 'edit',
      params: {
        type: 'object',
        properties: {
         
        },
      
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
  lov: {
    schema: { hide: false,
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
