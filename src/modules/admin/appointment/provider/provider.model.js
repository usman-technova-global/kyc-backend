const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const PROVIDER_SCHEDULE_LIMIT = 7;

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.APPOINTMENT_PROVIDER)
    .where({ tenant: param.tenant, is_deleted: false })
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const count = async (param) =>
  knex(MODULE.APPOINTMENT_PROVIDER)
    .count('id')
    .where({ tenant: param.tenant, is_deleted: false });

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    tenant: param.tenant,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT *
      FROM appointment_provider
      WHERE tenant = :tenant AND is_deleted = false AND LOWER(name) LIKE LOWER(:search)
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
    tenant: param.tenant,
  };
  return knex.raw(
    `SELECT COALESCE(COUNT(id), 0) AS count FROM appointment_provider WHERE tenant = :tenant and is_deleted = false and LOWER(name) LIKE LOWER(:search)`,
    bindParam
  );
};

const create = async (data) => {
  const transaction = await knex.transaction();
  try {
    const providerData = {
      id: data.id,
      name: data.name,
      address: data.address,
      phone: data.phone,
      cnic: data.cnic,
      is_active: data.is_active,
      is_deleted: data.is_deleted,
      email: data.email,
      urgent_fee: data.urgent_fee,
      tenant: data.tenant,
      created_by: data.created_by,
      updated_by: data.created_by,
    };
    const provider = (
      await transaction(MODULE.APPOINTMENT_PROVIDER)
        .insert(providerData)
        .returning('*')
    )[0];

    if (!provider) {
      await transaction.rollback();
      const newError = new Error(`No Appointment Provider`);
      newError.detail = `Appointment provider Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const newArr = data.work_days.map((item) => {
      const providerScheduleData = {
        id: uuidv4(),
        appointment_provider: provider.id,
        start_time: data.start_time,
        end_time: data.end_time,
        work_day: item,
        is_active: true,
        is_deleted: false,
        created_by: data.created_by,
        updated_by: data.created_by,
      };
      return providerScheduleData;
    });

    const providerSchedule = await transaction(
      MODULE.APPOINTMENT_PROVIDER_SCHEDULE
    )
      .insert(newArr)
      .returning('*');

    if (providerSchedule.length <= 0) {
      await transaction.rollback();
      const newError = new Error(`No Appointment Provider Schedule`);
      newError.detail = `Appointment provider schedule Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const newData = {
      id: provider.id,
      address: provider.address,
      cnic: provider.cnic,
      email: provider.email,
      created_by: provider.created_by,
      name: provider.name,
      phone: provider.phone,
      urgent_fee: provider.urgent_fee,
      tenant: provider.tenant,
      is_active: provider.is_active,
      updated_by: provider.updated_by,
    };
    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return newData;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findById = (id) =>
  knex(MODULE.APPOINTMENT_PROVIDER).where('id', id).first();

const findAppointmentByProviderId = async (data) => {
  // console.log('data', data);
  const columns = [
    knex.raw(
      `'#APP'::text || to_char(appointment.created_date, 'YYMM') || lpad(appointment.appointment_number::text, 6, '0'::text) AS appointment_number`
    ),
    'id',
    'name',
    'phone',
    'gst_percentage',
    'gst_amount',
    'total_amount',
    'grand_total',
    'urgent_fee',
    'sub_total_amount',
    'appointment_time',
    'status',
  ];

  const query = knex
    .from(MODULE.APPOINTMENT)
    .whereRaw('appointment_provider = ?', [data.providerId])
    .andWhereRaw('appointment_time::date >= date(?)', [
      moment().format('YYYY-MM-DD'),
    ])
    .andWhere((queryBuilder) => {
      if (data.search) {
        queryBuilder
          .orWhereRaw('appointment.appointment_number::text LIKE ?', [
            `%${data.search}%`,
          ])
          .orWhereRaw('LOWER(appointment.name) LIKE LOWER(?)', [
            `%${data.search}%`,
          ])
          .orWhereRaw('LOWER(appointment.phone) LIKE LOWER(?)', [
            `%${data.search}%`,
          ]);
      }
    });
  const totalQuery = query.clone().count();
  const filteredQuery = query
    .clone()
    .select(columns)
    .orderBy('appointment_time', 'ASC')
    .limit(data.size)
    .offset(data.page * data.size);

  const multiQuery = [totalQuery, filteredQuery].join(';');

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

const update = async (data, id) => {
  const provider = await knex(MODULE.APPOINTMENT_PROVIDER)
    .where('id', id)
    .first();

  const checkProvider = await knex.raw(
    `SELECT * FROM appointment_provider WHERE NOT id = : id AND(email = : email OR cnic = : cnic OR phone = : phone)`,
    {
      id,
      email: data.email,
      cnic: data.cnic,
      phone: data.phone,
    }
  );

  if (checkProvider && checkProvider.rows.length > 0) {
    let msg = 'Provider ';
    const phoneMatch = checkProvider.rows.some(
      (item) => item.phone === data.phone
    );
    const emailMatch = checkProvider.rows.some(
      (item) => item.email === data.email
    );
    const cnicMatch = checkProvider.rows.some(
      (item) => item.cnic === data.cnic
    );
    if (phoneMatch) msg += 'phone';
    if (emailMatch) msg += ', email';
    if (cnicMatch) msg += ', cnic';

    msg += ' already exist';
    const newError = new Error(`Provider already Exist'`);
    newError.detail = msg;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const newData = {
    name: data.name,
    address: data.address,
    updated_by: data.updated_by,
    updated_date: data.updated_date,
    urgent_fee: data.urgent_fee,
  };
  if (provider.email !== data.email) newData.email = data.email;
  if (provider.phone !== data.phone) newData.phone = data.phone;
  if (provider.cnic !== data.cnic) newData.cnic = data.cnic;

  return knex(MODULE.APPOINTMENT_PROVIDER).update(newData).where('id', id);
};

const updateStatus = (data, id) =>
  knex(MODULE.APPOINTMENT_PROVIDER).update(data).where('id', id);

const providerDetailById = async (id) => {
  const columns = [
    'ap.*',
    knex.raw(`
      CASE
        WHEN count(aps.*) = 0 THEN '[]'::json
        ELSE json_agg(aps.*)
      END AS appointment_provider_schedule
    `),
  ];

  return knex
    .select(columns)
    .from('appointment_provider as ap')
    .leftJoin(
      'appointment_provider_schedule as aps',
      'aps.appointment_provider',
      'ap.id'
    )
    .where('ap.id', id)
    .groupBy('ap.id');
};

const scheduleList = async (id) => {
  const columns = [
    'ap.*',
    knex.raw(`
      CASE
        WHEN count(aps.*) = 0 THEN '[]'::json
        ELSE json_agg(aps.*)
      END AS appointment_provider_schedule
    `),
  ];

  const provider = await knex
    .select(columns)
    .from('appointment_provider as ap')
    .leftJoin(
      'appointment_provider_schedule as aps',
      'aps.appointment_provider',
      'ap.id'
    )
    .where({ 'ap.id': id })
    .groupBy('ap.id')
    .first();

  return provider;
};

const scheduleCreate = async (data) => {
  const newArr = data.work_days.map((item) => ({
    appointment_provider: data.appointment_provider,
    work_day: item.day,
    start_time: moment(item.start_time).format('YYYY-MM-DD HH:mm:ss'),
    end_time: moment(item.end_time).format('YYYY-MM-DD HH:mm:ss'),
    is_active: true,
    created_by: data.created_by,
    updated_by: data.created_by,
  }));
  const checkIsScheduled = await knex(
    MODULE.APPOINTMENT_PROVIDER_SCHEDULE
  ).where({
    appointment_provider: data.appointment_provider,
    is_deleted: false,
  });

  if (checkIsScheduled && checkIsScheduled.length >= PROVIDER_SCHEDULE_LIMIT) {
    const newError = new Error(`No Provider Schedule`);
    newError.detail = `Provider schedule exceed the limit`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  return knex(MODULE.APPOINTMENT_PROVIDER_SCHEDULE)
    .insert(newArr)
    .returning('*');
};

const scheduleFind = async (id) =>
  knex
    .select('*')
    .from(MODULE.APPOINTMENT_PROVIDER_SCHEDULE)
    .where('id', id)
    .first();

const scheduleUpdate = async (data, id) =>
  knex(MODULE.APPOINTMENT_PROVIDER_SCHEDULE).update(data).where('id', id);

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  findById,
  update,
  updateStatus,
  scheduleList,
  scheduleCreate,
  scheduleFind,
  scheduleUpdate,
  providerDetailById,
  findAppointmentByProviderId,
};
