const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const deletePrevPlan = async (param) => {
  await knex(MODULE.NEW_EARTH.PROJECT_PLANS)
    .where({
      project_id: param.projectId,
      tenant: param.tenantId,
    })
    .update({ is_deleted: true });
};

const storeProjectPlans = async (param, data) => {
  await deletePrevPlan(param);
  if (data.length) {
    const newData = data.map((item) => ({
      day: item.sheetName,
      project_id: param.projectId,
      tenant: param.tenantId,
      file_path: param.filePath,
      data: JSON.stringify(item.data),
    }));

    const planCreate = await knex(MODULE.NEW_EARTH.PROJECT_PLANS)
      .insert(newData)
      .returning('*');
    if (!planCreate.length) {
      const newError = new Error(`No Project Plan`);
      newError.detail = `Project Plan is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // Join the inserted data with the project table to include name and start_date
    const enrichedPlanCreate = await knex(
      `${MODULE.NEW_EARTH.PROJECT_PLANS} as pp`
    )
      .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pp.project_id', 'p.id')
      .where(
        'pp.id',
        'in',
        planCreate.map((plan) => plan.id)
      )
      .select(
        'pp.*',
        'p.name as project_name',
        'p.start_date as project_start_date'
      );

    return enrichedPlanCreate;
  }
  const newError = new Error(`No Project Plan`);
  newError.detail = `Project Plan service is not execute`;
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

const planLOVService = async (param) => {
  // Build the base query
  const query = knex(MODULE.NEW_EARTH.PROJECT_PLANS)
    .select('day as id', 'day as name')
    .whereRaw('project_id = ?', [param.projectId])
    .andWhere('tenant', param.tenant)
    .whereRaw('is_deleted = ?', [false]);

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
    .whereRaw('pp.tenant = ?', [param.tenant])
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

const deletePrevRecordToUpdate = async (param, data = []) => {
  const days = data.map((item) => item.sheetName);

  await knex(MODULE.NEW_EARTH.PROJECT_PLANS)
    .where({
      project_id: param.projectId,
      tenant: param.tenantId,
    })
    .whereIn('day', days)
    .update({ is_deleted: true });
};

const updateProjectPlans = async (param, data) => {
  await deletePrevRecordToUpdate(param, data);
  if (data.length) {
    const newData = data.map((item) => ({
      day: item.sheetName,
      project_id: param.projectId,
      tenant: param.tenantId,
      file_path: param.filePath,
      data: JSON.stringify(item.data),
    }));

    const planCreate = await knex(MODULE.NEW_EARTH.PROJECT_PLANS)
      .insert(newData)
      .returning('*');
    if (!planCreate.length) {
      const newError = new Error(`No Project Plan`);
      newError.detail = `Project Plan Update is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // Join the inserted data with the project table to include name and start_date
    const enrichedPlanCreate = await knex(
      `${MODULE.NEW_EARTH.PROJECT_PLANS} as pp`
    )
      .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pp.project_id', 'p.id')
      .where(
        'pp.id',
        'in',
        planCreate.map((plan) => plan.id)
      )
      .where(
        'pp.day',
        'in',
        planCreate.map((plan) => plan.day)
      )
      .select(
        'pp.*',
        'p.name as project_name',
        'p.start_date as project_start_date'
      );

    return enrichedPlanCreate;
  }
  const newError = new Error(`No Project Plan`);
  newError.detail = `Project Plan Update service is not execute`;
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

module.exports = {
  storeProjectPlans,
  planListService,
  updateProjectPlans,
  planLOVService,
};
