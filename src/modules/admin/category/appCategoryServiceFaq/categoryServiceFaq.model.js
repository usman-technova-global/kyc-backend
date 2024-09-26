const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const IS_DELETED = false;

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.HOME_CATEGORY_ITEM_FAQ)
    .where('home_category_item', param.categoryServiceId)
    .andWhere('is_deleted', IS_DELETED)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const search = (param) => {
  const bindParam = {
    categoryServiceId: param.categoryServiceId,
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM home_cat_item_faq WHERE LOWER(question) LIKE LOWER(:search) and (home_category_item = :categoryServiceId and is_deleted = :isDeleted) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    categoryServiceId: param.categoryServiceId,
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM home_cat_item_faq WHERE LOWER(question) LIKE LOWER(:search) and (home_category_item = :categoryServiceId and is_deleted = :isDeleted) `,
    bindParam
  );
};

const count = async (param) =>
  knex(MODULE.HOME_CATEGORY_ITEM_FAQ)
    .count('id')
    .where('home_category_item', param.categoryServiceId)
    .andWhere('is_deleted', IS_DELETED);

const create = async (data) => knex(MODULE.HOME_CATEGORY_ITEM_FAQ).insert(data);

const update = async (data, id) =>
  knex(MODULE.HOME_CATEGORY_ITEM_FAQ).update(data).where('id', id);

const findById = (id) =>
  knex.select('*').from(MODULE.HOME_CATEGORY_ITEM_FAQ).where('id', id);

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  update,
  findById,
};
