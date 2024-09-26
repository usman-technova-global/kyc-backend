const swagger = {
  login: {
    schema: {
      description: 'this will login backOffice user',
      tags: ['superAdmin|BackOfficeUser'],
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

  profile: {
    schema: {
      description: 'this will get backOffice user details',
      tags: ['superAdmin|BackOfficeUser'],
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
    },
  },
  updateProfile: {
    schema: {
      description: 'this will get backOffice user details',
      tags: ['superAdmin|BackOfficeUser'],
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
    },
  },
  refreshToken: {
    schema: {
      description: 'this will refresh token',
      tags: ['superAdmin|BackOfficeUser'],
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
};

module.exports = swagger;
