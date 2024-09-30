const { ENUM } = require("sequelize");

const enumConstants = require("./../../../utils/constants/enumConstants")


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
         // full_name: { type: 'string' },
         // father_name: { type: 'string' },
         // gender: { type: 'string' },
        //  id_no: { type: 'string' },
         // issue_date: { type: 'string' , format: 'date' , description: "Date in YYYY-MM-DD format"   },
        //  expiry_date: { type: 'string' , format: 'date' , description: "Date in YYYY-MM-DD format" },
         // dob: { type: 'string' , format: 'date' , description: "Date in YYYY-MM-DD format" },
         // country: { type: 'string' },
         // state: { type: 'string' },
         // address: { type: 'string' },
          doc_front: { isFile: true },
          doc_back: { isFile: true },
          image: { isFile: true },
          tenant: { type: 'string' ,default : '0ff1d8ac-c1df-4ffe-9f3f-215e4fd3993e'},
        },
        required: [
        //  'full_name',
         // 'father_name',
         // 'gender',
        //  'id_no',
         // 'issue_date',
         // 'expiry_date',
         // 'dob',
         // 'country',
         // 'state',
         // 'address',
          'doc_front',
          'image',
        ],
        additionalProperties: false,
      },
    },
  },

  getCustomerList: {
    schema: {
      description: 'this will fetch user orders',
      tags: ['app|Customer'],
      summary: 'fetch customer',
      querystring: {
        searchName: { type: 'string', description: 'text to filter order with' },
        isVerified: {type: 'string', enum: [enumConstants.CUSTOMER_STATUS.VERIFIED,enumConstants.CUSTOMER_STATUS.UNVERIFIED] },
        offset: { type: 'integer', minimum: 0 },
        limit: { type: 'integer', minimum: 10 },
        tenant: { type: 'string' ,default : '0ff1d8ac-c1df-4ffe-9f3f-215e4fd3993e'},

      },
      // headers: {
      //   type: 'object',
      //   properties: {
      //     Authorization: { type: 'string' },
      //   },
      //   required: ['Authorization'],
      // },
                tenant: { type: 'string' ,default : '0ff1d8ac-c1df-4ffe-9f3f-215e4fd3993e'},

    },
  },


};



module.exports = swagger;
