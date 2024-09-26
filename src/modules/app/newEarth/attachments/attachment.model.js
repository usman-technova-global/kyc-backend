const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const attachmentListService = async (param) => {
  // Start building the query
  const query = knex
    .from(`${MODULE.NEW_EARTH.PROJECT_ATTACHMENT} as pa`)
    .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pa.project_id', 'p.id')
    .whereRaw('pa.tenant = ?', [param.tenantId])
    .whereRaw('pa.is_deleted = ?', [false]);

  // Add optional projectId criteria
  if (param.projectId) {
    query.andWhere((queryBuilder) => {
      queryBuilder.whereRaw('pa.project_id = ?', [param.projectId]);
    });
  }
  // Add optional search criteria
  if (param.search) {
    query.andWhere((queryBuilder) => {
      queryBuilder
        .whereRaw('pa.title ILIKE ?', [`%${param.search}%`])
        .orWhereRaw('pa.description ILIKE ?', [`%${param.search}%`])
        .orWhereRaw('pa.day ILIKE ?', [`%${param.search}%`]);
    });
  }

  // Add filter by attachment type if provided
  if (param.type) {
    query.andWhere('pa.attachment_type', param.type);
  }

  // Clone the query to get the total count
  const totalQuery = query.clone().count();

  // Apply pagination and select required columns
  const paginatedQuery = query
    .clone()
    .select(
      'pa.*',
      'p.name as project_name',
      'p.start_date as project_start_date'
    )
    .limit(param.size)
    .offset(param.page * param.size);

  // Execute the queries
  const [totalResult, paginatedResult] = await Promise.all([
    totalQuery,
    paginatedQuery,
  ]);

  // Extract the total count from the result
  const total = totalResult[0].count || 0;

  return {
    totalList: paginatedResult,
    total: parseInt(total, 10),
  };
};

module.exports = {
  attachmentListService,
};
