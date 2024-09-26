const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (data) => {

  const shopTypeQuery = knex
    .from(MODULE.SHOPTYPE)
    .where((queryBuilder) => {
      if (data.search) {
        queryBuilder.whereRaw('LOWER(shop_type.name) LIKE LOWER(?)', [
          `%${data.search}%`,
        ]);
      }
    })

  const totalShopTypeQuery = shopTypeQuery.clone().count();

  const shopTypeQueryFiltered = shopTypeQuery.clone().select('*').limit(data.size).offset(data.page * data.size)

  const multiQuery = [
    totalShopTypeQuery,
    shopTypeQueryFiltered,
  ].join(';');

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
}

const create = async (data) =>
  knex(MODULE.SHOPTYPE).insert(data).returning('*');

const update = async (id, data) =>
  knex(MODULE.SHOPTYPE).where('id', id).update(data).returning('*');

const findById = async (id) => knex(MODULE.SHOPTYPE).where('id', id).first();

module.exports = {
  list,
  create,
  findById,
  update
};
