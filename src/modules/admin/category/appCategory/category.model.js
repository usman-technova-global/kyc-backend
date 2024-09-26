const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const IS_DELETED = false;

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.HOME_CATEGORY)
    .where('tenant', param.tenant)
    .andWhere('is_deleted', IS_DELETED)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
    tenant: param.tenant,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM home_category WHERE LOWER(name) LIKE LOWER(:search) and (tenant = :tenant and is_deleted = :isDeleted) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
    tenant: param.tenant,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM home_category WHERE LOWER(name) LIKE LOWER(:search) and (tenant = :tenant and is_deleted = :isDeleted)`,
    bindParam
  );
};

const count = async (param) =>
  knex(MODULE.HOME_CATEGORY)
    .count('id')
    .where('tenant', param.tenant)
    .andWhere('is_deleted', IS_DELETED);

const create = async (data) => knex(MODULE.HOME_CATEGORY).insert(data);

const update = async (data, id) =>
  knex(MODULE.HOME_CATEGORY).update(data).where('id', id);

const findById = (id) =>
  knex.select('*').from(MODULE.HOME_CATEGORY).where('id', id);

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  update,
  findById,
};
