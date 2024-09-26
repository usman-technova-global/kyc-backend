const knex = require('../../../../config/databaseConnection');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const MODULE = require('../../../../utils/constants/moduleNames');

const categoryList = async (data) => {
  const query = knex(MODULE.STORE.SERVICE_CATEGORY)
    .where({
      tenant: data.tenant,
      is_deleted: false,
    })
    // .andWhere({
    //   is_deleted: false,
    // })
    .andWhere((queryBuilder) => {
      if (data.search) {
        queryBuilder.orWhereRaw('name ILIKE ?', [`%${data.search}%`]);
      }
    });

  const queryList = query
    .clone()
    .orderBy('created_date', 'desc')
    .limit(data.size)
    .offset(data.page * data.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const createCategory = (data) =>
  knex(MODULE.STORE.SERVICE_CATEGORY).insert(data).returning('*');

const updateCategory = async (data, param) => {
  /*   const findCategory = await knex(MODULE.STORE.SERVICE_CATEGORY)
    .where('id', param.categoryId)
    .first(); */

  const result = await knex(MODULE.STORE.SERVICE_CATEGORY)
    .update(data)
    .where('id', param.categoryId)
    .returning('*');

  if (!result.length) {
    const newError = new Error(`No Service Category`);
    newError.detail = `Service category is not found`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  return result;
};

const categoryItemList = async (data) => {
  const query = knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
    .where({
      store_service_category: data.categoryId,
      is_deleted: false,
    })
    .andWhere((queryBuilder) => {
      if (data.search) {
        queryBuilder.orWhereRaw('name ILIKE ?', [`%${data.search}%`]);
      }
    });

  const queryList = query
    .clone()
    .orderBy('created_date', 'desc')
    .limit(data.size)
    .offset(data.page * data.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const createCategoryItem = (data) =>
  knex(MODULE.STORE.SERVICE_CATEGORY_ITEM).insert(data).returning('*');

const updateCategoryItem = async (data, param) => {
  /*   const findCategory = await knex(MODULE.STORE.SERVICE_CATEGORY)
    .where('id', param.categoryId)
    .first(); */

  const result = await knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
    .update(data)
    .where('id', param.categoryItemId)
    .returning('*');

  if (!result.length) {
    const newError = new Error(`No Service Category Item`);
    newError.detail = `Service category item is not found`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  return result;
};

const categoryLov = (param) =>
  knex.select('id', 'name').from(MODULE.STORE.SERVICE_CATEGORY).where({
    tenant: param.tenant,
    is_deleted: false,
    is_active: true,
  });

const categoryItemLov = (param) =>
  knex.select('id', 'name').from(MODULE.STORE.SERVICE_CATEGORY_ITEM).where({
    store_service_category: param.categoryId,
    is_active: true,
    is_deleted: false,
  });

module.exports = {
  categoryList,
  createCategory,
  updateCategory,
  categoryItemList,
  createCategoryItem,
  updateCategoryItem,
  categoryLov,
  categoryItemLov,
};
