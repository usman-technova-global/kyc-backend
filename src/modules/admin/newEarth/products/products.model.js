// const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const list = async (param) => {
  const query = knex
    .from(MODULE.NEW_EARTH.PRODUCTS)
    .whereRaw('is_deleted = ?', [false])
    .whereRaw('tenant = ?', [param.tenant])
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.whereRaw('product_name ILIKE ?', [`%${param.search}%`]);
      }
    });

  const filteredQuery = query
    .clone()
    .select('*')
    .limit(param.size)
    .offset(param.page * param.size);

  const multiQuery = [query.clone().count(), filteredQuery].join(';');

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

const create = async (data) =>
  knex(MODULE.NEW_EARTH.PRODUCTS).insert(data).returning('*');

module.exports = {
  list,
  create,
};
