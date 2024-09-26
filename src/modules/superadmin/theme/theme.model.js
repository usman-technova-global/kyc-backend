const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (param) => {
  const query = knex.from(MODULE.THEME);

  const executeQuery = query
    .clone()
    .select(['*'])
    .orderBy('created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), executeQuery].join(';');

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

const lovList = async () => {
  const query = knex.from(MODULE.THEME);

  const executeQuery = query
    .clone()
    .select(['*'])
    .orderBy('created_date', 'desc');

  const multiQuery = [query.clone().count(), executeQuery].join(';');

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

const create = async (themeData) =>
  knex(MODULE.THEME).insert(themeData).returning('*');

const update = async (id, themeData) =>
  knex(MODULE.THEME).where('id', id).update(themeData).returning('*');

const search = async (param) => {
  const query = knex.from(MODULE.THEME).where((queryBuilder) => {
    if (param.search) {
      queryBuilder.whereRaw('LOWER(key) LIKE LOWER(:search)', {
        search: `%${param.search}%`,
      });
    }
  });

  const executeQuery = query
    .clone()
    .select(['*'])
    .orderBy('created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), executeQuery].join(';');

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

const findById = async (id) => knex(MODULE.THEME).where('id', id).first();

module.exports = {
  list,
  create,
  search,
  findById,
  lovList,
  update,
};
