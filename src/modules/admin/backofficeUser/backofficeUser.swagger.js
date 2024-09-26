const swagger = {
  userList: {
    schema: {
      description: 'this will list backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'list backOffice user',
    },
    headers: {
      type: 'object',
      properties: {
        Authorization: { type: 'string' },
      },
      required: ['Authorization'],
    },
  },

  userView: {
    schema: {
      description: 'this will get backOffice user details',
      tags: ['admin|BackOfficeUser'],
      summary: 'backOffice user details',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'backOffice user ID',
          },
        },
        required: ['userId'],
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

  createUser: {
    schema: {
      description: 'this will create backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'create backOffice user',
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          username: { type: 'string', format: 'email' },
          email: { type: 'string', format: 'email' },
          role: {
            type: 'string',
            format: 'uuid',
          },
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['password', 'username', 'email', 'role', 'tenant'],
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

  login: {
    schema: {
      description: 'this will login backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'login backOffice user',
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          username: { type: 'string', format: 'email' },
        },
        required: ['password', 'username'],
        additionalProperties: false,
      },
    },
  },

  list: {
    schema: {
      description: 'this will list backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'User List',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
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
      description: 'this will list backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'User List',
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'Tenant ID',
          },
          search: {
            type: 'string',
            description: 'search',
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

  insert: {
    schema: {
      description: 'this will create backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'create backOffice user',
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          email: { type: 'string', format: 'email' },
          role: { type: 'string', format: 'uuid' },
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          createdBy: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: [
          'firstName',
          'lastName',
          'password',
          'email',
          'tenant',
          'createdBy',
        ],
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
      description: 'this will create backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'create backOffice user',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'User ID',
          },
        },
        required: ['userId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', format: 'uuid' },
          tenant: {
            type: 'string',
            format: 'uuid',
          },
          updatedBy: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['firstName', 'lastName', 'tenant', 'updatedBy'],
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
      description: 'this will create backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'create backOffice user',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'User ID',
          },
        },
        required: ['userId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
          updatedBy: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['isActive', 'updatedBy'],
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

  deleteUser: {
    schema: {
      description: 'this will delete backOffice user',
      tags: ['admin|BackOfficeUser'],
      summary: 'delete backOffice user',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            description: 'User ID',
          },
        },
        required: ['userId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          updatedBy: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['updatedBy'],
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
  profile: {
    schema: {
      description: 'this will get backOffice user details',
      tags: ['admin|BackOfficeUser'],
      summary: 'backOffice user details',
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'backOffice user ID',
          },
        },
        required: ['userId'],
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
  updateProfile: {
    schema: {
      description: 'this will get backOffice user details',
      tags: ['admin|BackOfficeUser'],
      summary: 'backOffice user details',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          firstName: { type: 'string', default: ['', null] },
          lastName: { type: 'string', default: ['', null] },
          avatar: { isFile: true },
          address: { type: 'string', default: ['', null] },
          country: { type: 'string', default: ['', null] },
          state: { type: 'string', default: ['', null] },
          city: { type: 'string', default: ['', null] },
          zipCode: { type: 'string', default: ['', null] },
          phone: { type: 'string', default: ['', null] },
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
  secretUpdate: {
    schema: {
      description: 'this will get backOffice user details',
      tags: ['admin|BackOfficeUser'],
      summary: 'backOffice user details',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          currentParole: { type: 'string' },
          newParole: { type: 'string' },
        },
        required: ['id', 'currentParole', 'newParole'],
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
  refreshToken: {
    schema: {
      description: 'this will refresh token',
      tags: ['admin|BackOfficeUser'],
      summary: 'refresh token',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  getOTP: {
    schema: {
      description: 'this will send OTP to provided email',
      tags: ['admin|BackOfficeUser'],
      summary: 'get OTP email',
      body: {
        type: 'object',
        properties: { email: { type: 'string', format: 'email' } },
        required: ['email'],
        additionalProperties: false,
      },
    },
  },
  changePassword: {
    schema: {
      description: 'this will change password a user',
      tags: ['admin|BackOfficeUser'],
      summary: 'change password user',
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          email: { type: 'string', format: 'email' },
          otp: { type: 'string', minLength: 4, maxLength: 4 },
        },
        required: ['password', 'email', 'otp'],
        additionalProperties: false,
      },
    },
  },
  anonymousDetail: {
    schema: {
      description: 'this will anonymous detail',
      tags: ['admin|BackOfficeUser'],
      summary: 'anonymous detail',
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
