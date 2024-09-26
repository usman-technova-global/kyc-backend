// const knex = require('../../../config/databaseConnection');
// const MODULE = require('../../../utils/constants/moduleNames');
const faqModel = require('../../admin/faq/faq.model');

const list = async (param) => faqModel.list(param);

module.exports = {
  list,
};
