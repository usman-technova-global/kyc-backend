const swagger = {
  createUserApp: {
    schema: {
      description: 'this will create a user with type "App"',
      tags: ['app|User'],
      summary: 'create app user of type "App"',
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          email: { type: 'string', format: 'email' },
          tenant: { type: 'string', format: 'uuid' },
          phone: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          postalCode: { type: 'string' },
          otp: { type: 'string', minLength: 4, maxLength: 4 },
        },
        required: [
          'password',
          'email',
          'tenant',
          'phone',
          'firstName',
          'lastName',
          'postalCode',
          'otp',
        ],
        additionalProperties: false,
      },
    },
  },

  createUserDriver: {
    schema: {
      description: 'this will create a user with type "Driver"',
      tags: ['app|User'],
      summary: 'create app user of type "Driver"',
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          email: { type: 'string', format: 'email' },
          tenant: { type: 'string', format: 'uuid' },
          phone: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          postalCode: { type: 'string' },
          otp: { type: 'string', minLength: 4, maxLength: 4 },
        },
        required: [
          'password',
          'email',
          'tenant',
          'phone',
          'firstName',
          'lastName',
          'postalCode',
          'otp',
        ],
        additionalProperties: false,
      },
    },
  },

  signInApp: {
    schema: {
      description: 'this will sign in user of type "App"',
      tags: ['app|User'],
      summary: 'sign in "App" user',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['email', 'password', 'tenant'],
        additionalProperties: false,
      },
    },
  },

  signInAppFacebook: {
    schema: {
      description: 'this will sign in with facebook user of type "App"',
      tags: ['app|User'],
      summary: 'sign in with facebook "App" user',
      body: {
        type: 'object',
        properties: {
          accessToken: { type: 'string' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['accessToken', 'tenant'],
        additionalProperties: false,
      },
    },
  },

  signInDriver: {
    schema: {
      description: 'this will sign in user of type "Driver"',
      tags: ['app|User'],
      summary: 'sign in "Driver" user',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['email', 'password', 'tenant'],
        additionalProperties: false,
      },
    },
  },

  updateUser: {
    schema: {
      description: 'this will update user with all the properties provided',
      tags: ['app|User'],
      summary: 'update user',
      body: {
        type: 'object',
        properties: {
          phone: { type: 'string' },
          isActive: { type: 'boolean' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          postalCode: { type: 'string' },
          currentPassword: { type: 'string', minLength: 3 },
          newPassword: { type: 'string', minLength: 3 },
          verifyPassword: { type: 'string', minLength: 3 },
        },
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

  getOTP: {
    schema: {
      description: 'this will send OTP to provided email',
      tags: ['app|User'],
      summary: 'get OTP email',
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
      body: {
        type: 'object',
        properties: { email: { type: 'string', format: 'email' } },
        required: ['email'],
        additionalProperties: false,
      },
    },
  },

  getProfile: {
    schema: {
      description: 'this will fetch user profile data',
      tags: ['app|User'],
      summary: 'get user profile',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  setStatus: {
    schema: {
      description: 'this will set driver status',
      tags: ['app|User'],
      summary: 'set driver status',
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['Online', 'Offline'] },
        },
        required: ['status'],
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

  forgotPasswordDriver: {
    schema: {
      description: 'this will send password recovery email to driver',
      tags: ['app|User'],
      summary: 'send password recovery email to driver',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['email', 'tenant'],
        additionalProperties: false,
      },
    },
  },

  resetPasswordDriver: {
    schema: {
      description: 'this will reset driver password',
      tags: ['app|User'],
      summary: 'reset driver password',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          tenant: { type: 'string', format: 'uuid' },
          otp: { type: 'string', minLength: 4, maxLength: 4 },
        },
        required: ['email', 'password', 'tenant', 'otp'],
        additionalProperties: false,
      },
    },
  },

  forgotPasswordApp: {
    schema: {
      description: 'this will send password recovery email to user',
      tags: ['app|User'],
      summary: 'send password recovery email to user',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['email', 'tenant'],
        additionalProperties: false,
      },
    },
  },

  resetPasswordApp: {
    schema: {
      description: 'this will reset user password',
      tags: ['app|User'],
      summary: 'reset user password',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          tenant: { type: 'string', format: 'uuid' },
          otp: { type: 'string', minLength: 4, maxLength: 4 },
        },
        required: ['email', 'password', 'tenant', 'otp'],
        additionalProperties: false,
      },
    },
  },
  loyaltyHistoryList: {
    schema: {
      description: 'this will list loyalty history',
      tags: ['app|Order'],
      summary: 'list loyalty history',
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
