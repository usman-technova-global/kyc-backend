const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const { promiseHandler } = require('../../../utils/commonUtils/promiseHandler');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { validate: isUUID } = require('uuid');


const createCustomer = async (customerData) => knex(MODULE.CUSTOMER).insert(customerData);
const findByIdNoAndStatus = async (idno, status) =>
  knex(MODULE.CUSTOMER).where({ id_no: idno, status: status, is_deleted: false}).first();
const findById = async (id)=>{
  if (!isUUID(id)) {
    throw new Error('Invalid UUID format');
  }
  return knex.select('*').from(MODULE.CUSTOMER).where('id', id).first();
}

const updateStatus = (data, id) =>
  knex(MODULE.CUSTOMER).update(data).where('id', id);

// Assuming you have the necessary imports and knex setup

const getCustomerList = async (custData) => {
  // Base query for customers with pagination
  let customersQuery = knex
    .select('*')
    .from(MODULE.CUSTOMER)
    .orderBy('created_date', 'desc')
    .offset(custData.offset)
    .limit(custData.limit);
    customersQuery = customersQuery.andWhere('is_deleted', false); 
  // Filter by verified/unverified if applicable
  console.log("----custData.isVerified---print----",custData.is_verified)

  if (custData.is_verified !== undefined) {
    console.log("----custData.isVerified----")
    customersQuery = customersQuery.andWhere('status', custData.is_verified); 
  }

  // Search by customer name if applicable
  console.log("----custData.searchName---print----",custData.search_name)
  if (custData.search_name) {
    console.log("----custData.searchName----")
    customersQuery = customersQuery.andWhere('full_name', 'like', `%${custData.search_name}%`);
  }
  console.log("query   ",  customersQuery.toSQL());
  // Total customers query for counting
  const totalCustomersQuery = knex
    .count('* as total')
    .from(MODULE.CUSTOMER);

    totalCustomersQuery.andWhere('is_deleted', false); 

  // Apply the same filters to total count query for consistency
  if (custData.is_verified !== undefined) {
    totalCustomersQuery.andWhere('status', custData.is_verified);
  }
  if (custData.search_name) {
    totalCustomersQuery.andWhere('full_name', 'like', `%${custData.search_name}%`);
  }

  // Execute both queries in parallel
  const [totalCustomers, customers] = await Promise.all([
    totalCustomersQuery,
    customersQuery
  ]);

  const keysToRemove = ['imagelivenessresponse', 'dataextractionresponse'];

const newCustomers = customers.map(item => {
    // Create a shallow copy of the object
    const newItem = { ...item };
    // Delete specified keys
    keysToRemove.forEach(key => {
        delete newItem[key]; // Delete the key from the copied object
    });
    return newItem; // Return the modified object
});
  // Assemble the final response
  return {
    customers: newCustomers, // Assuming `customers` holds the customer data
    page: Math.floor(custData.offset / custData.limit) + 1, // Calculate the current page
    perPage: custData.limit, // Items per page
    totalPages: Math.ceil(totalCustomers[0].total / custData.limit), // Total pages
    totalResults: Number(totalCustomers[0].total) // Total count of results
  };
};



module.exports = {
  createCustomer,
  findByIdNoAndStatus,
  getCustomerList,
  findById,
  updateStatus
};
