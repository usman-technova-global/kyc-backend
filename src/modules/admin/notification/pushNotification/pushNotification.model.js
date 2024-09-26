const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

// id	notification	success	failure	success_token	failure_token	created_date
const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.NOTIFICATION)
    .where('tenant', param.tenant)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    tenant: param.tenant,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT id, title, description, status FROM notification WHERE (LOWER(title) LIKE LOWER(:search)) and tenant = :tenant ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    tenant: param.tenant,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM notification WHERE  (LOWER(title) LIKE LOWER(:search)) and tenant = :tenant`,
    bindParam
  );
};

const count = async (param) =>
  knex(MODULE.NOTIFICATION).count('id').where('tenant', param.tenant);

const create = async (data) => knex(MODULE.NOTIFICATION).insert(data);

const update = async (data, id) =>
  knex(MODULE.NOTIFICATION).update(data).where('id', id);

const findById = (id) =>
  knex.select('*').from(MODULE.NOTIFICATION).where('id', id);

const batchDetail = (id) => {
  const columns = [
    knex.raw(
      `(SELECT COALESCE(SUM(success),0) AS success from notification_batch where notification=:id) AS success`,
      { id }
    ),
    knex.raw(
      `(SELECT COALESCE(SUM(failure),0) AS failure from notification_batch where notification=:id) AS failure `,
      { id }
    ),
  ];
  return knex
    .select(columns)
    .from('notification_batch')
    .where('notification', id);
};

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  update,
  findById,
  batchDetail,
};
