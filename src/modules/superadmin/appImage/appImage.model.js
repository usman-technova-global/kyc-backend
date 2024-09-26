const knex = require('../../../config/databaseConnection');

const tableName = 'app_image';
const list = async (param) => {
  const columns = ['id', 'name', 'desc', 'avatar', 'is_active', 'created_date'];
  return knex
    .select(columns)
    .from(tableName)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};

const count = async () => knex(tableName).count('id');

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM app_image WHERE LOWER(name) LIKE LOWER(:search) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM app_image WHERE LOWER(name) LIKE LOWER(:search)`,
    bindParam
  );
};

const findById = async (id) => {
  const columns = ['id', 'name', 'desc', 'avatar', 'is_active', 'created_date'];

  return knex.select(columns).from(tableName).where('id', id).first();
};
const create = async (data) => knex(tableName).insert(data);

const update = async (data, id) => knex(tableName).update(data).where('id', id);

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  findById,
  update,
};
