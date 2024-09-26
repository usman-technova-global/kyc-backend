/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
const moment = require('moment');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  APPOINTMENT_STATUS,
} = require('../../../../utils/constants/enumConstants');

const list = async (param) =>
  // knex
  //     .select('*')
  //     .select(
  //       'appointment.*',
  //       knex.raw(
  //         `'#'::text || to_char(appointment.created_date, 'YYMM') || lpad(appointment.appointment_number::text, 4, '0'::text) AS appointment_number`
  //       )
  //     )
  //     .from(MODULE.APPOINTMENT)
  //     .where({ tenant: param.tenant })
  //     .orderBy('created_date', 'desc')
  //     .limit(param.size)
  //     .offset(param.page * param.size);

  knex
    .select('*')
    .select(
      'appointment.*',
      knex.raw(
        `'#APP'::text || to_char(appointment.created_date, 'YYMM') || lpad(appointment.appointment_number::text, 6, '0'::text) AS appointment_number`
      )
    )
    .from(MODULE.APPOINTMENT)
    .where({ tenant: param.tenant })
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const count = async (param) =>
  knex(MODULE.APPOINTMENT).count('id').where({ tenant: param.tenant });

const search = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    tenant: param.tenant,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT *,
    '#APP'::text || to_char(appointment.created_date, 'YYMM') || lpad(appointment.appointment_number::text, 6, '0'::text) AS appointment_number
    FROM appointment
    WHERE tenant = :tenant AND (LOWER(name) LIKE LOWER(:search) OR appointment_number::text LIKE :search)
    ORDER BY created_date DESC 
    LIMIT :limit
    OFFSET :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    tenant: param.tenant,
  };
  return knex.raw(
    `SELECT COALESCE(COUNT(id), 0) AS count FROM appointment WHERE tenant = :tenant and (LOWER(name) LIKE LOWER(:search) OR appointment_number::text LIKE :search)`,
    bindParam
  );
};
const checkAppointment = async (data) => {
  const result = { hasError: true };
  result.appointment_time = data.appointment_time;
  let appointment = await knex.raw(
    `SELECT * FROM appointment 
    WHERE tenant=:tenant AND appointment_time::date = date(:appointmentDate) AND appointment_provider = :appointmentProvider AND name=:name AND phone=:phone`,
    {
      tenant: data.tenant,
      appointmentDate: moment(data.appointment_time).format('YYYY-MM-DD'),
      appointmentProvider: data.appointment_provider,
      name: data.name,
      phone: data.phone,
    }
  );

  if (appointment && appointment.rows.length) {
    appointment = appointment.rows.filter((item) => {
      if (
        item.status === data.status ||
        item.status === APPOINTMENT_STATUS.COMPLETED ||
        item.status === APPOINTMENT_STATUS.CANCELLED
      ) {
        return item;
      }
      return null;
    });
    if (appointment.length > 0) {
      result.hasError = true;
      result.message = 'Appointment is already scheduled';
      return result;
    }
  }
  const providerSchedule = await knex(
    MODULE.APPOINTMENT_PROVIDER_SCHEDULE
  ).where({
    appointment_provider: data.appointment_provider,
    is_active: true,
  });
  const availableDay = moment(data.appointment_time).format('dddd');
  const availability = providerSchedule.filter(
    (item) => item.work_day === availableDay
  );

  if (availability.length) {
    const time = moment(data.appointment_time).format('HH:mm:ss');
    const newTime = moment(time, 'HH:mm:ss').unix();
    const scheduleStartTime = moment(
      availability[0].start_time,
      'HH:mm:ss'
    ).unix();
    const scheduleEndTime = moment(availability[0].end_time, 'HH:mm:ss').unix();
    if (scheduleStartTime > newTime && scheduleEndTime < newTime) {
      result.hasError = true;
      result.message = 'Provider time is not match in your appointment time';
      return result;
    }

    let index = 0;
    while (true) {
      const appointmentTime = await knex(MODULE.APPOINTMENT).where({
        appointment_time: moment(
          moment(data.appointment_time).add(index, 'minutes')
        ).format('YYYY-MM-DD HH:mm'),
      });
      if (appointmentTime && appointmentTime.length) {
        index += 1;
      } else {
        break;
      }
    }

    result.appointment_time = moment(
      moment(data.appointment_time).add(index, 'minutes')
    ).format('YYYY-MM-DD HH:mm');
  } else {
    result.hasError = true;
    result.message = 'Today provider is not available';
    return result;
  }

  result.hasError = false;
  return result;
};

const appointmentCount = async (time, tenant) => {
  const month = moment(time).format('MM');
  const year = moment(time).format('YYYY');
  const appointmentCountResult = await knex.raw(
    `
    SELECT count(id) as count
    FROM appointment
    WHERE
    tenant = ?
    AND EXTRACT('year' FROM appointment.appointment_time) = ?
    AND EXTRACT('month' FROM appointment.appointment_time) = ?;
  `,
    [tenant, year, month]
  );
  return appointmentCountResult.rows[0].count;
};

const findById = (appointmentId) =>
  knex
    .select([
      'appointment.*',
      knex.raw(
        `'#APP'::text || to_char(appointment.created_date, 'YYMM') || lpad(appointment.appointment_number::text, 6, '0'::text) AS appointment_number`
      ),
    ])
    .from(MODULE.APPOINTMENT)
    .where('id', appointmentId)
    .first();

const create = async (data) => {
  const newData = data;
  const createResult = { hasError: false, item: {} };
  const checkAppointmentService = await checkAppointment(newData);
  if (checkAppointmentService.hasError) {
    createResult.hasError = true;
    createResult.message = checkAppointmentService.message;
    return createResult;
  }

  newData.appointment_time = checkAppointmentService.appointment_time;
  const newNumber = await appointmentCount(
    newData.appointment_time,
    newData.tenant
  );
  newData.appointment_service = JSON.stringify(newData.appointment_service);
  newData.appointment_number = Number(newNumber) + 1;

  let totalAmount = 0;
  let subTotalAmount = 0;
  let urgentFee = 0;
  const appointmentService = JSON.parse(newData.appointment_service);
  if (appointmentService.length <= 0) {
    createResult.hasError = true;
    createResult.message = 'No services found';
    return createResult;
  }

  const appServices = await knex(MODULE.APPOINTMENT_SERVICE).whereIn(
    'id',
    appointmentService
  );

  totalAmount = appServices.reduce(
    (previousValue, currentValue) => previousValue + currentValue.fees,
    0
  );
  subTotalAmount = totalAmount;
  if (newData.is_urgent) {
    const appointmentProvider = await knex(MODULE.APPOINTMENT_PROVIDER)
      .where('id', newData.appointment_provider)
      .first();

    urgentFee = appointmentProvider.urgent_fee;
    totalAmount = appointmentProvider.urgent_fee + totalAmount;
  }

  const tenant = await knex('tenant')
    .leftJoin('tenant_config as tc', 'tc.id', 'tenant.tenant_config')
    .where('tenant.id', newData.tenant)
    .groupBy('tenant.id', 'tc.id')
    .first();

  const gstPercentage = tenant.gst_percentage;
  const gstAmount = totalAmount * (gstPercentage / 100);
  const grandTotal = gstAmount + totalAmount;
  newData.gst_percentage = gstPercentage;
  newData.gst_amount = gstAmount;
  newData.urgent_fee = urgentFee;
  newData.sub_total_amount = subTotalAmount;
  newData.total_amount = totalAmount;
  newData.grand_total = grandTotal;

  // return;

  const insertDataQUery = (
    await knex(MODULE.APPOINTMENT).insert(newData).returning('*')
  )[0];
  const insertData = await findById(insertDataQUery.id);
  if (!insertData) {
    createResult.hasError = true;
    createResult.message = 'No insert record';
    return createResult;
  }
  createResult.hasError = false;
  createResult.message = 'insert record';
  createResult.item = insertData;
  return createResult;
};

const reSchedule = async (data, appointmentId) => {
  const rescheduleResult = { hasError: false, item: {} };
  const currentDate = moment(new Date(), 'YYYY-MM-DD').unix();
  if (moment(data.appointment_time, 'YYYY-MM-DD').unix() >= currentDate) {
    const appointment = await knex(MODULE.APPOINTMENT)
      .where({
        id: appointmentId,
      })
      .first();
    if (appointment && Object.keys(appointment).length > 0) {
      if (appointment.status === APPOINTMENT_STATUS.RESCHEDULE) {
        rescheduleResult.hasError = true;
        rescheduleResult.message = 'Appointment has been already rescheduled';
        return rescheduleResult;
      }
      await knex(MODULE.APPOINTMENT)
        .update({ status: APPOINTMENT_STATUS.RESCHEDULE })
        .where('id', appointmentId);
      return create(data);
    }
    rescheduleResult.hasError = true;
    rescheduleResult.message =
      'Appointment is not found please check the appoint ID';
    return rescheduleResult;
  }
  rescheduleResult.hasError = true;
  rescheduleResult.message =
    'Appointment reschedule time must be greater then current time';
  return rescheduleResult;
};

const lovProvider = async (tenant) =>
  knex(MODULE.APPOINTMENT_PROVIDER).where({
    tenant,
    is_active: true,
    is_deleted: false,
  });

const lovService = async (providerId) =>
  knex(MODULE.APPOINTMENT_SERVICE).where({
    appointment_provider: providerId,
    is_active: true,
    is_deleted: false,
  });

const update = async (data, findResult, appointmentId) => {
  const currentDate = moment(new Date(), 'YYYY-MM-DD HH:mm').unix();
  if (
    moment(findResult.appointment_time, 'YYYY-MM-DD HH:mm').unix() < currentDate
  ) {
    const newError = new Error(`No Appointment Update`);
    newError.detail = `Appointment updated date must be a greater or equal then current date`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  return knex(MODULE.APPOINTMENT).update(data).where('id', appointmentId);
};

const detail = async (appointmentId) => {
  const appointmentColumns = [
    'appointment.*',
    knex.raw(
      `'#APP'::text || to_char(appointment.created_date, 'YYMM') || lpad(appointment.appointment_number::text, 6, '0'::text) AS "appointment_number"`
    ),
  ];

  const appointment = await knex
    .select(appointmentColumns)
    .from(MODULE.APPOINTMENT)
    .where('id', appointmentId)
    .first();

  const providerColumns = [
    'ap.*',
    knex.raw(
      `CASE WHEN count(aps.*) = 0 THEN '[]'::json ELSE json_agg(aps.*) END AS appointment_provider_schedule`
    ),
  ];
  const appointmentProvider = await knex
    .select(providerColumns)
    .from('appointment_provider as ap')
    .leftJoin(
      'appointment_provider_schedule as aps',
      'aps.appointment_provider',
      'ap.id'
    )
    .where('ap.id', appointment.appointment_provider)
    .groupBy('ap.id')
    .first();

  const appointmentService = await knex(MODULE.APPOINTMENT_SERVICE).whereIn(
    'id',
    appointment.appointment_service
  );

  return {
    ...appointment,
    appointment_provider: appointmentProvider,
    appointment_service: appointmentService,
  };
};

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  create,
  findById,
  reSchedule,
  lovProvider,
  lovService,
  update,
  detail,
};
