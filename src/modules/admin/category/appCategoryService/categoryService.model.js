const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const IS_DELETED = false;

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.HOME_CATEGORY_ITEM)
    .where('home_category', param.categoryId)
    .andWhere('is_deleted', IS_DELETED)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const search = (param) => {
  const bindParam = {
    categoryId: param.categoryId,
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM home_cat_item WHERE LOWER(name) LIKE LOWER(:search) and (home_category = :categoryId and is_deleted = :isDeleted) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    categoryId: param.categoryId,
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM home_cat_item WHERE LOWER(name) LIKE LOWER(:search) and (home_category = :categoryId and is_deleted = :isDeleted) `,
    bindParam
  );
};

const count = async (param) =>
  knex(MODULE.HOME_CATEGORY_ITEM)
    .count('id')
    .where('home_category', param.categoryId)
    .andWhere('is_deleted', IS_DELETED);

const create = async (data) => knex(MODULE.HOME_CATEGORY_ITEM).insert(data);

const update = async (data, id) =>
  knex(MODULE.HOME_CATEGORY_ITEM).update(data).where('id', id);

const findById = (id) =>
  knex.select('*').from(MODULE.HOME_CATEGORY_ITEM).where('id', id);

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  update,
  findById,
};
