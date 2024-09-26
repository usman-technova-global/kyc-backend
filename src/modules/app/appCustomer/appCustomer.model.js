const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const { promiseHandler } = require('../../../utils/commonUtils/promiseHandler');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const createCustomer = async (customerData) => knex(MODULE.CUSTOMER).insert(customerData);
const findByIdNoAndStatus = async (idno, status) =>
  knex(MODULE.CUSTOMER).where({ id_no: idno, status: status }).first();

module.exports = {
  createCustomer,
  findByIdNoAndStatus
};
