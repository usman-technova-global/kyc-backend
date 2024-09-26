const knex = require('../../config/databaseConnection');

// Function to perform CRUD operations on a given table
const modelHelper = async (tableName, operation, id, data, conditions = {}) => {
  switch (operation) {
    case 'find':
      return knex(tableName).where('id', id).first();
    case 'get':
      // if (Object.keys(conditions).length === 0) {
      //     return knex(tableName).select('*');
      // }
      if (typeof conditions === 'string') {
        return knex(tableName).whereRaw(conditions);
      }
      return knex(tableName).where({ ...conditions, is_deleted: false });
    case 'store':
      return knex(tableName).insert(data);
    case 'update':
      if (id) {
        return knex(tableName).update(data).where('id', id);
      }
      if (typeof conditions === 'string') {
        return knex(tableName).update(data).whereRaw(conditions);
      }
      return knex(tableName).update(data).where(conditions);

    case 'delete':
      if (id) {
        return knex(tableName).where('id', id).del();
      }
      if (typeof conditions === 'string') {
        return knex(tableName).whereRaw(conditions).del();
      }
      return knex(tableName)
        .where({ ...conditions, is_deleted: false })
        .del();

    default:
      throw new Error('Invalid operation');
  }
};

module.exports = {
  modelHelper,
};
