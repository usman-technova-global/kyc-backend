const serviceName = 'app user';
const swagger = {
  login: {
    schema: {
      description: 'this will login app user',
      tags: ['admin|AppUser'],
      summary: 'Login Admin App User',
      body: {
        type: 'object',
        properties: {
          identifier: { type: 'string' },
          tenant: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['identifier', 'tenant'],
        additionalProperties: false,
      },
    },
  },

  anonymousLogin: {
    schema: {
      description: 'this will login app user',
      tags: ['admin|AppUser'],
      summary: 'Login Admin App User',
      body: {
        type: 'object',
        properties: {
          identifier: { type: 'string' },
        },
        required: ['identifier'],
        additionalProperties: false,
      },
    },
  },

  list: {
    schema: {
      description: `this will list ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `${serviceName} with pagination`,
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
          userType: {
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
        required: ['tenant', 'userType', 'page', 'size'],
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
      description: `this will search ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `${serviceName} with search`,
      params: {
        type: 'object',
        properties: {
          tenant: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
          userType: {
            type: 'string',
            description: 'search string',
          },
          search: {
            type: 'string',
            description: 'search string',
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
        required: ['tenant', 'userType', 'search', 'page', 'size'],
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

  create: {
    schema: {
      description: `this will create ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `create ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', pattern: '^[a-zA-Z0-9]{3,30}$' },
          phone: { type: 'string', default: null },
          postalCode: { type: 'string', default: null },
          address: { type: 'string' },
          userType: { type: 'string' },
          licenseNumber: { type: 'string', default: null },
          tenant: { type: 'string', format: 'uuid' },
          createdBy: { type: 'string', format: 'uuid' },
        },
        required: [
          'firstName',
          'lastName',
          'email',
          'password',
          'address',
          'userType',
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

  edit: {
    schema: {
      description: `this will find ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `${serviceName} with find`,
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
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

  update: {
    schema: {
      description: `this will create ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `create ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string', default: null },
          postalCode: { type: 'string', default: null },
          userType: { type: 'string' },
          licenseNumber: { type: 'string', default: null },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['id', 'firstName', 'lastName', 'userType', 'updatedBy'],
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
      description: `this will update ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `update ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['id', 'isActive', 'updatedBy'],
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
      description: `this will delete ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `delete ${serviceName}`,
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['id', 'updatedBy'],
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

  detail: {
    schema: {
      description: `this will detail ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `${serviceName} with detail`,
      params: {
        type: 'object',
        properties: {
          userId: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
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

  addressCreate: {
    schema: {
      description: `this will create ${serviceName} address`,
      tags: ['admin|AppUser'],
      summary: `create ${serviceName} address`,
      body: {
        type: 'object',
        properties: {
          appUser: { type: 'string', format: 'uuid' },
          latitude: { type: 'number', format: 'float', default: 0 },
          longitude: { type: 'number', format: 'float', default: 0 },
          type: { type: 'string', enum: ['Home', 'Office', 'Other'] },
          address: { type: 'string' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['appUser', 'type', 'address', 'tenant'],
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

  addressEdit: {
    schema: {
      description: `this will find ${serviceName} address`,
      tags: ['admin|AppUser'],
      summary: `${serviceName} address with find`,
      params: {
        type: 'object',
        properties: {
          addressId: {
            type: 'string',
            format: 'uuid',
            description: 'app user address ID',
          },
        },
        required: ['addressId'],
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

  addressUpdate: {
    schema: {
      description: `this will update ${serviceName} address`,
      tags: ['admin|AppUser'],
      summary: `update ${serviceName} address`,
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          latitude: { type: 'number', format: 'float', default: 0 },
          longitude: { type: 'number', format: 'float', default: 0 },
          type: { type: 'string', enum: ['Home', 'Office', 'Other'] },
          address: { type: 'string' },
        },
        required: ['id', 'type', 'address'],
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

  addressUpdateStatus: {
    schema: {
      description: `this will update ${serviceName} address`,
      tags: ['admin|AppUser'],
      summary: `update ${serviceName} address`,
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          isActive: { type: 'boolean' },
        },
        required: ['id', 'isActive'],
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

  scheduleCreate: {
    schema: {
      description: 'this will insert new driver schedule',
      tags: ['admin|AppUser'],
      summary: 'create new driver schedule',
      body: {
        type: 'object',
        properties: {
          workDays: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: {
                  type: 'string',
                  enum: [
                    'Sunday',
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                  ],
                },
                startTime: { type: 'string', format: 'date-time' },
                endTime: { type: 'string', format: 'date-time' },
              },
              required: ['day', 'startTime', 'endTime'],
              additionalProperties: false,
            },
          },
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'user ID',
          },
          createdBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['workDays', 'appUser', 'createdBy'],
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

  scheduleFind: {
    schema: {
      description: 'this will find schedule',
      tags: ['admin|AppUser'],
      summary: 'driver schedule',
      params: {
        type: 'object',
        properties: {
          scheduleId: {
            type: 'string',
            format: 'uuid',
            description: 'tenant ID',
          },
        },
        required: ['scheduleId'],
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

  scheduleUpdate: {
    schema: {
      description: 'this will update schedule',
      tags: ['admin|AppUser'],
      summary: 'update schedule',
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'schedule ID' },
          workDay: {
            type: 'string',
            enum: [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ],
          },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['id', 'workDay', 'startTime', 'endTime', 'updatedBy'],
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

  scheduleUpdateStatus: {
    schema: {
      description: 'this will update status schedule',
      tags: ['admin|AppUser'],
      summary: 'update status schedule',
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', description: 'schedule ID' },
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid', description: 'user ID' },
        },
        required: ['id', 'isActive', 'updatedBy'],
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
  voucherHistoryList: {
    schema: {
      description: 'this will list voucher history',
      tags: ['admin|AppUser'],
      summary: 'list voucher history',
      params: {
        type: 'object',
        properties: {
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
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
        required: ['appUser', 'page', 'size'],
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
  voucherHistorySearch: {
    schema: {
      description: 'this will search voucher history',
      tags: ['admin|AppUser'],
      summary: 'search voucher history',
      params: {
        type: 'object',
        properties: {
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
          },
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
        required: ['appUser', 'search', 'page', 'size'],
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
  voucherHistorydetail: {
    schema: {
      description: 'this will list voucher history',
      tags: ['admin|AppUser'],
      summary: 'list voucher history',
      params: {
        type: 'object',
        properties: {
          voucherHistoryId: {
            type: 'string',
            format: 'uuid',
            description: 'history ID',
          },
        },
        required: ['voucherHistoryId'],
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
  loyaltyHistoryList: {
    schema: {
      description: 'this will list loyalty history',
      tags: ['admin|AppUser'],
      summary: 'list loyalty history',
      params: {
        type: 'object',
        properties: {
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
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
        required: ['appUser', 'page', 'size'],
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
  loyaltyHistorySearch: {
    schema: {
      description: 'this will search loyalty history',
      tags: ['admin|AppUser'],
      summary: 'search loyalty history',
      params: {
        type: 'object',
        properties: {
          appUser: {
            type: 'string',
            format: 'uuid',
            description: 'User ID',
          },
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
        required: ['appUser', 'search', 'page', 'size'],
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
  loyaltyHistorydetail: {
    schema: {
      description: 'this will list loyalty history',
      tags: ['admin|AppUser'],
      summary: 'list loyalty history',
      params: {
        type: 'object',
        properties: {
          loyaltyHistoryId: {
            type: 'string',
            format: 'uuid',
            description: 'history ID',
          },
        },
        required: ['loyaltyHistoryId'],
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
  driverList: {
    schema: {
      description: 'this will search driver history',
      tags: ['admin|AppUser'],
      summary: 'search driver history',
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
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
  driverDetail: {
    schema: {
      description: 'this will search driver history',
      tags: ['admin|AppUser'],
      summary: 'search driver history',
      querystring: {
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
        to: { type: 'string', format: 'date' },
        from: { type: 'string', format: 'date' },
      },
      params: {
        type: 'object',
        properties: {
          appUser: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['appUser'],
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
  driverWalletDetail: {
    schema: {
      description: 'this will search driver history',
      tags: ['admin|AppUser'],
      summary: 'search driver history',
      querystring: {
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
        to: { type: 'string', format: 'date' },
        from: { type: 'string', format: 'date' },
      },
      params: {
        type: 'object',
        properties: {
          wallets: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['wallets'],
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

  lov: {
    schema: {
      description: `this will list lov ${serviceName}`,
      tags: ['admin|AppUser'],
      summary: `${serviceName} lov`,
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
