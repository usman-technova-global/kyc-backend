const swagger = {
  login: {
    schema: {
      description: 'this will login staffApp user',
      tags: ['staffApp|Employee'],
      summary: 'login staffApp user',
      body: {
        type: 'object',
        properties: {
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          identifier: { type: 'string' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['password', 'identifier', 'tenant'],
        additionalProperties: false,
      },
    },
  },
  registerDevice: {
    schema: {
      description: 'this will register device staffApp user',
      tags: ['staffApp|Employee'],
      summary: 'register device staffApp user',
      body: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          deviceType: { type: 'string' },
          deviceId: { type: 'string' },
        },
        required: ['token', 'deviceType', 'deviceId'],
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
  attendanceScan: {
    schema: {
      description: 'this will check scan',
      tags: ['staffApp|Employee'],
      summary: 'scan check',
      body: {
        type: 'object',
        properties: {
          latitude: {
            type: 'number',
            format: 'float',
          },
          longitude: {
            type: 'number',
            format: 'float',
          },
        },
        required: ['latitude', 'longitude'],
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
  attendanceCheck: {
    schema: {
      description: 'this will check attendance',
      tags: ['staffApp|Employee'],
      summary: 'check attendance',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  attendanceWeekly: {
    schema: {
      description: 'this will find weekly attendance',
      tags: ['staffApp|Employee'],
      summary: 'find weekly attendance',
      params: {
        type: 'object',
        properties: {
          week: {
            type: 'integer',
            format: 'int32',
          },
        },
        required: ['week'],
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
  leaveManagement: {
    schema: {
      description: 'this will staffApp leave management',
      tags: ['staffApp|Employee'],
      summary: 'staffApp leave management',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  leaveManagementCreate: {
    schema: {
      description: 'this will staffApp leave management',
      tags: ['staffApp|Employee'],
      summary: 'staffApp leave management',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          leaveType: { type: 'string' },
          fromDate: { type: 'string', format: 'date-time' },
          toDate: { type: 'string', format: 'date-time' },
          halfDay: { type: 'boolean', default: false },
          note: { type: 'string' },
          attachment: {
            oneOf: [
              { type: 'array', items: { isFile: true } },
              { type: 'object', isFile: true },
            ],
          },
        },
        required: ['leaveType', 'fromDate', 'toDate', 'halfDay'],
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
  payroll: {
    schema: {
      description: 'this will staffApp payroll',
      tags: ['staffApp|Employee'],
      summary: 'staffApp payroll',
      params: {
        type: 'object',
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
          },
        },
        required: ['date'],
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
      description: 'this will staffApp profile',
      tags: ['staffApp|Employee'],
      summary: 'staffApp profile',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  schedule: {
    schema: {
      description: 'this will staffApp profile',
      tags: ['staffApp|Employee'],
      summary: 'staffApp profile',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  changeProfileAvatar: {
    schema: {
      description: 'this will staffApp change profile avatar',
      tags: ['staffApp|Employee'],
      summary: 'staffApp change profile avatar',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          avatar: { isFile: true },
        },
        required: ['avatar'],
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
  forgotPasswordApp: {
    schema: {
      description: 'this will send password recovery email to employee',
      tags: ['staffApp|Employee'],
      summary: 'send password recovery email to employee',
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
      description: 'this will reset employee password',
      tags: ['staffApp|Employee'],
      summary: 'reset employee password',
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
};

module.exports = swagger;
