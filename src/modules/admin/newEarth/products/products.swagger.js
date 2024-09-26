const swagger = {
  list: {
    schema: {
      description: 'this will list products',
      tags: ['New Earth|Products'],
      summary: 'list products',
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
      description: 'this will add product',
      tags: ['NewEarth|Products'],
      summary: 'create new product',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          productGroup: { type: 'string' },
          productName: { type: 'string' },
          mobileNumber: { type: 'string' },
          itemCode: { type: 'string' },
          brandName: { type: 'string' },
          costPrice: { type: 'number', format: 'int32' },
          tax: { type: 'number', format: 'int32' },
          itemWeight: { type: 'number', format: 'int32' },
          itemDimension: { type: 'number', format: 'int32' },
          address: { type: 'string' },
          desc: { type: 'string' },
          vendorDiscount: { type: 'number', format: 'int32' },
          stockAvailability: { type: 'string' },
          stockQuantity: { type: 'string' },
          stockDimension: { type: 'string' },
          sparePartAvailability: { type: 'string' },
          warranty: { type: 'string' },
          serviceCenter: { type: 'number', format: 'int32' },
          rustProof: { type: 'string' },
          averageLife: { type: 'string' },
          features: { type: 'string' },
          productCustomization: { type: 'string' },
          productImages: { isFile: true },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: ['productName', 'productGroup', 'tenant'],
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

  update: {
    schema: {
      description: 'this will update project',
      tags: ['NewEarth|Projects'],
      summary: 'update project by id',
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
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          clientName: { type: 'string', format: 'uuid' },
          supervisorName: { type: 'string' },
          type: { type: 'string' },
          constructionType: { type: 'string' },
          budget: { type: 'string' },
          totalPaid: { type: 'string' },
          dueAmount: { type: 'string' },
          address: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          tenant: { type: 'string', format: 'uuid' },
        },
        required: [
          'name',
          'clientName',
          'supervisorName',
          'type',
          'constructionType',
          'startDate',
          'endDate',
          'budget',
        ],
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

  updateStatus: {
    schema: {
      description: 'this will update project status',
      tags: ['NewEarth|Projects'],
      summary: 'update project status by id',
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
      body: {
        type: 'object',
        properties: {
          isActive: { type: 'boolean' },
        },
        required: ['isActive'],
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

  delete: {
    schema: {
      description: 'this will delete project',
      tags: ['NewEarth|Projects'],
      summary: 'update project delete by id',
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
      body: {
        type: 'object',
        properties: {
          isDeleted: { type: 'boolean' },
        },
        required: ['isDeleted'],
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
};

module.exports = swagger;
