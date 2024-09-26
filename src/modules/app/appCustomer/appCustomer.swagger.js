const swagger = {
  createCustomer: {
    schema: {
      description: 'this will create a Customer',
      tags: ['app|Customer'],
      summary: 'create app Customer',
      consumes: ['multipart/form-data'],
      body: {
        type: 'object',
        properties: {
          full_name: { type: 'string' },
          father_name: { type: 'string' },
          gender: { type: 'string' },
          id_no: { type: 'string' },
          issue_date: { type: 'string' , format: 'date' , description: "Date in YYYY-MM-DD format"   },
          expiry_date: { type: 'string' , format: 'date' , description: "Date in YYYY-MM-DD format" },
          dob: { type: 'string' , format: 'date' , description: "Date in YYYY-MM-DD format" },
          country: { type: 'string' },
          state: { type: 'string' },
          address: { type: 'string' },
          doc_front: { isFile: true },
          doc_back: { isFile: true },
          image: { isFile: true },
          tenant: { type: 'string' },
        },
        required: [
          'full_name',
          'father_name',
          'gender',
          'id_no',
          'issue_date',
          'expiry_date',
          'dob',
          'country',
          'state',
          'address',
          'doc_front',
          'image',
        ],
        additionalProperties: false,
      },
    },
  },

};

module.exports = swagger;
