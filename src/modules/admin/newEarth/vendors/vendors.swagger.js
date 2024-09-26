const swagger = {
  list: {
    schema: {
      description: 'this will list vendors',
      tags: ['NewEarth|Vendors'],
      summary: 'list vendors',
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
  lov: {
    schema: {
      description: 'this will list vendors',
      tags: ['NewEarth|Vendors'],
      summary: 'list vendors',
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
      description: 'this will find vendors',
      tags: ['NewEarth|Vendors'],
      summary: 'find vendors',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
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

  store: {
    schema: {
      description: 'this will create vendors',
      tags: ['NewEarth|Vendors'],
      summary: 'create new vendors',
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          vendorType: {
            type: 'string',
          },
          serviceType: {
            type: 'string',
          },
          contact: {
            type: 'string',
          },
          bankName: {
            type: 'string',
          },
          iban: {
            type: 'string',
          },
          location: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          deliveryTime: {
            type: 'string',
          },
          deliveryTerms: {
            type: 'string',
          },
          paymentTerms: {
            type: 'string',
          },
        },
        required: [
          'name',
          'email',
          'vendorType',
          'serviceType',
          'contact',
          'bankName',
          'iban',
          'location',
          'city',
          'country',
          'deliveryTime',
          'deliveryTerms',
          'paymentTerms',
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
      description: 'this will update vendors',
      tags: ['NewEarth|Vendors'],
      summary: 'update vendors',
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
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          vendorType: {
            type: 'string',
          },
          serviceType: {
            type: 'string',
          },
          contact: {
            type: 'string',
          },
          bankName: {
            type: 'string',
          },
          iban: {
            type: 'string',
          },
          location: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          country: {
            type: 'string',
          },
          deliveryTime: {
            type: 'string',
          },
          deliveryTerms: {
            type: 'string',
          },
          paymentTerms: {
            type: 'string',
          },
        },
        required: [],
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
      description: 'this will upload vendors',
      tags: ['NewEarth|Vendors'],
      summary: 'delete vendors',
      body: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
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
};

module.exports = swagger;
