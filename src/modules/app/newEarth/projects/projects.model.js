// const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const projectListService = async (param) => {
  const query = knex
    .from(MODULE.NEW_EARTH.PROJECTS)
    .whereRaw('is_deleted = ?', [false])
    .whereRaw('tenant = ?', [param.tenantId])
    .whereRaw('client_name = ?', [param.userId])
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.whereRaw('name ILIKE ?', [`${param.search}`]);
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

const projectLOVService = async (param) => {
  // Build the base query
  const query = knex(MODULE.NEW_EARTH.PROJECTS)
    .select('id', 'name')
    .where('is_deleted', false)
    .whereRaw('client_name = ?', [param.userId])
    .andWhere('tenant', param.tenantId);

  // Add search functionality if a search term is provided
  if (param.search) {
    query.andWhere('name', 'ILIKE', `%${param.search}%`);
  }

  // Execute the query to get the list of values
  const totalList = await query;

  return {
    totalList,
    total: totalList.length,
  };
};

module.exports = {
  projectListService,
  projectLOVService,
};
