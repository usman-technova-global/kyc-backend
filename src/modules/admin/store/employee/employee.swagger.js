const swagger = {
  list: {
    schema: {
      description: 'this will list store employee',
      tags: ['admin|Store|Employee'],
      summary: 'store employee',
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

  create: {
    schema: {
      description: 'this will insert new store employee',
      tags: ['admin|Store|Employee'],
      summary: 'create new store employee',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: {
            type: 'string',
            pattern: '^[a-zA-Z0-9]{3,30}$',
          },
          dob: { type: 'string', format: 'date' },
          cnic: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          note: { type: 'string', default: '' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          payrollType: {
            type: 'string',
            enum: ['Salary', 'Commission', 'Both'],
          },
          salary: { type: 'number', format: 'double', default: 0 },
          avatar: { isFile: true },
          workDays: {
            type: 'string',
            default: null,
          },
          services: { type: 'string', default: null },
        },
        required: [
          'name',
          'password',
          'cnic',
          'phone',
          'address',
          'startTime',
          'endTime',
          'payrollType',
          'workDays',
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

  find: {
    schema: {
      description: 'this will find store employee',
      tags: ['admin|Store|Employee'],
      summary: 'find store employee',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
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
      description: 'this will update store employee',
      tags: ['admin|Store|Employee'],
      summary: 'update store employee',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          password: {
            type: 'string',
            pattern: '^[a-zA-Z0-9]{3,30}$',
          },
          dob: { type: 'string', format: 'date' },
          cnic: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          payrollType: {
            type: 'string',
            enum: ['Salary', 'Commission', 'Both'],
          },
          salary: { type: 'number', format: 'double', default: 0 },
          avatar: { isFile: true },
          note: { type: 'string', default: '' },
          services: { type: 'string', default: null },
          deletedIds: { type: 'string', default: null },
        },
        required: [
          'name',
          'cnic',
          'phone',
          'address',
          'payrollType',
          'deletedIds',
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

  updateStatus: {
    schema: {
      description: 'this will status update store employee',
      tags: ['admin|Store|Employee'],
      summary: 'status update store employee',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
        },
        required: ['isActive'],
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

  delete: {
    schema: {
      description: 'this will delete store employee',
      tags: ['adminStoreEmployee'],
      summary: 'delete store employee',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isDeleted: { type: 'boolean' },
        },
        required: ['isDeleted'],
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

  employeeServiceList: {
    schema: {
      description: 'this will store employee services',
      tags: ['admin|Store|Employee'],
      summary: 'store employee services fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
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

  employeeServiceLov: {
    schema: {
      description: 'this will store employee services',
      tags: ['admin|Store|Employee'],
      summary: 'store employee services fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
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

  employeeLov: {
    schema: {
      description: 'this will store employees',
      tags: ['admin|Store|Employee'],
      summary: 'store employees fetched',
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },

  employeeServiceCreate: {
    schema: {
      description: 'this will store employee service create',
      tags: ['admin|Store|Employee'],
      summary: 'store employee service create',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
        additionalProperties: false,
      },
      body: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            storeServiceCategoryItem: { type: 'string', format: 'uuid' },
            serviceTime: { type: 'integer', format: 'int32', default: 0 },
            amountType: {
              type: 'string',
              enum: ['None', 'Amount', 'Percentage'],
              default: 'None',
            },
            amount: { type: 'number', default: 0 },
          },
          required: ['storeServiceCategoryItem'],
          additionalProperties: false,
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

  employeeServiceUpdate: {
    schema: {
      description: 'this will store employee service update',
      tags: ['admin|Store|Employee'],
      summary: 'store employee service update',
      params: {
        type: 'object',
        properties: {
          serviceId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['serviceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          storeServiceCategoryItem: { type: 'string', format: 'uuid' },
          serviceTime: { type: 'integer', format: 'int32', default: 0 },
          amountType: {
            type: 'string',
            enum: ['None', 'Amount', 'Percentage'],
            default: 'None',
          },
          amount: { type: 'number', default: 0 },
        },
        required: ['storeServiceCategoryItem'],
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
  employeeServiceUpdateStatus: {
    schema: {
      description: 'this will store employee service status update',
      tags: ['admin|Store|Employee'],
      summary: 'store employee service status update',
      params: {
        type: 'object',
        properties: {
          serviceId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['serviceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
        },
        required: ['isActive'],
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
  employeeServiceDelete: {
    schema: {
      description: 'this will store employee service delete',
      tags: ['admin|Store|Employee'],
      summary: 'store employee service delete',
      params: {
        type: 'object',
        properties: {
          serviceId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['serviceId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {},
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

  employeeScheduleList: {
    schema: {
      description: 'this will list employee schedule',
      tags: ['admin|Store|Employee'],
      summary: 'employee schedule list fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
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

  employeeScheduleCreate: {
    schema: {
      description: 'this will create employee schedule',
      tags: ['admin|Store|Employee'],
      summary: 'create employee schedule',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
        additionalProperties: false,
      },
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
        },
        required: ['workDays'],
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

  employeeScheduleUpdate: {
    schema: {
      description: 'this will update employee schedule',
      tags: ['admin|Store|Employee'],
      summary: 'update employee schedule',
      params: {
        type: 'object',
        properties: {
          scheduleId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['scheduleId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          workDay: { type: 'string' },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
        },
        required: ['workDay', 'startTime', 'endTime'],
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

  employeeScheduleUpdateStatus: {
    schema: {
      description: 'this will status update employee schedule',
      tags: ['admin|Store|Employee'],
      summary: 'status update employee schedule',
      params: {
        type: 'object',
        properties: {
          scheduleId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['scheduleId'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
        },
        required: ['isActive'],
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
  attendanceList: {
    schema: {
      description: 'this will list employee attendance',
      tags: ['admin|Store|Employee'],
      summary: 'employee attendance list fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
          date: {
            type: 'string',
            format: 'date',
          },
        },
        required: ['employeeId', 'date'],
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
  leave: {
    schema: {
      description: 'this will list employee leave',
      tags: ['admin|Store|Employee'],
      summary: 'employee leave list fetched',
      querystring: {
        search: { type: 'string' },
        page: { type: 'integer', format: 'int32', minimum: 0, default: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10, default: 10 },
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
      description: 'this will list employee leave',
      tags: ['admin|Store|Employee'],
      summary: 'employee leave list fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
          date: { type: 'string', format: 'date' },
        },
        required: ['employeeId', 'date'],
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
      description: 'this will list employee detail',
      tags: ['admin|Store|Employee'],
      summary: 'employee detail fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
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
  reviews: {
    schema: {
      description: 'this will list employee rating reviews',
      tags: ['admin|Store|Employee'],
      summary: 'employee rating reviews fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
        additionalProperties: false,
      },
      querystring: {
        search: { type: 'string' },
        page: { type: 'integer', format: 'int32', minimum: 0, default: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10, default: 10 },
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
  distinctStarList: {
    schema: {
      description: 'this will list employee distinct stars',
      tags: ['admin|Store|Employee'],
      summary: 'employee distinct stars fetched',
      params: {
        type: 'object',
        properties: {
          employeeId: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['employeeId'],
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

  leaveManagementUpdateStatus: {
    schema: {
      description: 'this will status update store employee leave status',
      tags: ['admin|Store|Employee'],
      summary: 'status update store employee leave status',
      params: {
        type: 'object',
        properties: {
          storeEmployeeLeave: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['storeEmployeeLeave'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['Approved', 'Rejected'] },
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
  expenseList: {
    schema: {
      description: 'this will list expense',
      tags: ['admin|Store|Employee'],
      summary: 'expense fetched',
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'integer', format: 'int32', minimum: 0 },
          size: { type: 'integer', format: 'int32', minimum: 10 },
          expenseType: {
            type: 'string',
            enum: [
              'None',
              'Salary',
              'Utility',
              'Maintenance',
              'EquipmentPurchase',
              'Other',
            ],
          },
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
        },
        required: ['page', 'size', 'expenseType', 'startDate', 'endDate'],
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
  expenseCreate: {
    schema: {
      description: 'this will insert expense',
      tags: ['admin|Store|Employee'],
      summary: 'create expense',
      body: {
        type: 'object',
        properties: {
          expenseType: {
            type: 'string',
            enum: [
              'None',
              'Salary',
              'Utility',
              'Maintenance',
              'EquipmentPurchase',
              'Other',
            ],
          },
          expenseDetails: { type: 'array' },
        },
        required: ['expenseType', 'expenseDetails'],
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
