const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const planLOVService = async (param) => {
  // Build the base query
  const query = knex(MODULE.NEW_EARTH.PROJECT_PLANS)
    .select('day as id', 'day as name')
    .whereRaw('project_id = ?', [param.projectId])
    .whereRaw('is_deleted = ?', [false])
    .andWhere('tenant', param.tenantId);

  // Add search functionality if a search term is provided
  if (param.search) {
    query.andWhere('day', 'ILIKE', `%${param.search}%`);
  }

  // Execute the query to get the list of values
  const totalList = await query;

  return {
    totalList,
    total: totalList.length,
  };
};

const planListService = async (param) => {
  const query = knex
    .from(`${MODULE.NEW_EARTH.PROJECT_PLANS} as pp`)
    .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pp.project_id', 'p.id')
    .whereRaw('pp.tenant = ?', [param.tenantId])
    .whereRaw('pp.project_id = ?', [param.projectId])
    .whereRaw('pp.is_deleted = ?', [false])
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.whereRaw('pp.day ILIKE ?', [`${param.search}`]);
      }
    });

  const filteredQuery = query
    .clone()
    .select(
      'pp.*',
      'p.name as project_name',
      'p.start_date as project_start_date'
    )
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

module.exports = {
  planListService,
  planLOVService,
};
