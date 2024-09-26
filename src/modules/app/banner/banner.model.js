const knex = require('../../../config/databaseConnection');

const tableName = 'banner';
const list = async (tenant) =>
  knex
    .select('*')
    .from(tableName)
    .where({ tenant, is_active: true, is_deleted: false })
    .orderBy('created_date', 'desc');

module.exports = {
  list,
};
