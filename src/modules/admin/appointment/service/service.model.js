const knex = require('../../../../config/databaseConnection');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const MODULE = require('../../../../utils/constants/moduleNames');

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.APPOINTMENT_SERVICE)
    .where({ appointment_provider: param.providerId, is_deleted: false })
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const count = async (param) =>
  knex(MODULE.APPOINTMENT_SERVICE)
    .count('id')
    .where({ appointment_provider: param.providerId, is_deleted: false });

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    appointmentProvider: param.providerId,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT *
      FROM appointment_service
      WHERE appointment_provider = :appointmentProvider AND is_deleted = false AND LOWER(name) LIKE LOWER(:search)
      ORDER BY created_date DESC 
      LIMIT :limit 
      offset :offset
    `,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    appointmentProvider: param.providerId,
  };
  return knex.raw(
    `SELECT COALESCE(COUNT(id), 0) AS count FROM appointment_service WHERE appointment_provider = :appointmentProvider and is_deleted = false and LOWER(name) LIKE LOWER(:search)`,
    bindParam
  );
};

const create = (data) =>
  knex(MODULE.APPOINTMENT_SERVICE).insert(data).returning('*');

const findById = (id) =>
  knex(MODULE.APPOINTMENT_SERVICE).where('id', id).first();

const update = async (data, id) => {
  const providerService = await knex(MODULE.APPOINTMENT_SERVICE)
    .where('id', id)
    .first();
  const checkProviderService = await knex.raw(
    `SELECT * FROM appointment_service WHERE NOT id = :id AND tenant = :tenant AND name = :name AND appointment_provider = :appointmentProvider`,
    {
      id,
      tenant: providerService.tenant,
      name: data.name,
      appointmentProvider: data.appointment_provider,
    }
  );

  if (checkProviderService && checkProviderService.rows.length > 0) {
    const newError = new Error(`Provider service is already Exist'`);
    newError.detail = 'Provider service is already exist';
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  const newData = {
    fees: data.fees,
    desc: data.desc,
    updated_by: data.updated_by,
    updated_date: data.updated_date,
  };
  if (data.name !== providerService.name) newData.name = data.name;
  return knex(MODULE.APPOINTMENT_SERVICE).update(data).where('id', id);
};

const updateStatus = async (data, id) =>
  knex(MODULE.APPOINTMENT_SERVICE).update(data).where('id', id);

const lovProvider = async (tenant) =>
  knex(MODULE.APPOINTMENT_PROVIDER).where({
    tenant,
    is_active: true,
    is_deleted: false,
  });

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  findById,
  update,
  lovProvider,
  updateStatus,
};
