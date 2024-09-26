/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
const moment = require('moment');
const knex = require('../../../config/databaseConnection');
const {
  generateRandomString,
  getTenantConfig,
} = require('../../../utils/commonUtil');
const {
  APPOINTMENT_STATUS,
  RATING_STATUS,
  LEAVE_STATUS,
  PAYMENT_STATUS,
} = require('../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');
const employeeModel = require('../../admin/store/employee/employee.model');

const list = async (param) => {
  const currentDate = moment().add(4, 'month');
  const oneYearAgoDate = moment().subtract(8, 'month');
  return knex
    .select(
      'sa.*',
      knex.raw(`json_agg(se.*) -> 0 as store_employee`),
      knex.raw(`json_agg(ssci.*) -> 0 as store_service_category_item`)
    )
    .from(`${MODULE.STORE.APPOINTMENT} as sa`)
    .leftJoin(`${MODULE.STORE.EMPLOYEE} as se`, 'se.id', 'sa.store_employee')
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .where('app_user', param.userId)
    .whereBetween('sa.appointment_time', [
      oneYearAgoDate.format('YYYY-MM-DD'),
      currentDate.format('YYYY-MM-DD'),
    ])
    .groupBy('sa.id');
};

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

const categories = (param) =>
  knex.select('id', 'name').from(MODULE.STORE.SERVICE_CATEGORY).where({
    tenant: param.tenantId,
    is_active: true,
    is_deleted: false,
  });

const categoryItems = async (data) => {
  const query = knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
    .where({
      store_service_category: data.categoryId,
      is_active: true,
      is_deleted: false,
    })
    .andWhere((queryBuilder) => {
      if (data.search) {
        queryBuilder.orWhereRaw('name ILIKE ?', [`%${data.search}%`]);
      }
    });

  const queryList = query
    .clone()
    .orderBy('created_date', 'desc')
    .offset(data.page * data.size)
    .limit(data.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

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

const serviceCategoryItem = async (data) =>
  knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
    .where('id', data.categoryItemId)
    .first();

const serviceProviders = async (param) => {
  const findEmployees = await knex
    .select([
      'service.*',
      knex.raw(`json_agg(employee.*) -> 0 AS store_employee`),
      knex.raw(
        `CASE WHEN count(schedule.*) = 0 THEN '[]'::json ELSE json_agg(schedule.*) END AS store_employee_schedule`
      ),
    ])
    .from(`${MODULE.STORE.EMPLOYEE_SERVICE} as service`)
    .leftJoin(
      `${MODULE.STORE.EMPLOYEE} as employee`,
      'employee.id',
      'service.store_employee'
    )
    .leftJoin(
      `${MODULE.STORE.EMPLOYEE_SCHEDULE} as schedule`,
      'schedule.store_employee',
      'service.store_employee'
    )
    .where('store_service_category_item', param.categoryItemId)
    .andWhere({ 'service.is_deleted': false, 'service.is_active': true })
    .andWhere({ 'employee.is_deleted': false, 'employee.is_active': true })
    .andWhere({ 'schedule.is_active': true, 'schedule.is_deleted': false })
    .groupBy('service.id');

  const employeeList = findEmployees.map(async (item) => {
    const [rating] = await knex(MODULE.STORE.EMPLOYEE_RATING)
      .sum('star')
      .where('store_employee', item.id);

    const [ratingCount] = await knex(MODULE.STORE.EMPLOYEE_RATING)
      .count('star')
      .where('store_employee', item.id);

    const totalRating = rating.sum ?? 0;
    const totalCounts = Number(ratingCount.count);

    const totalStarRating = totalRating / totalCounts;
    item.rating = Number.isNaN(totalStarRating)
      ? 0
      : parseInt(totalStarRating, 10);

    return item;
  });

  const promiseQuery = await Promise.all(employeeList);

  return promiseQuery;
};

const checkAppointment = async (param, data) => {
  const result = { hasError: false };
  const newAppointmentArr = [];
  // console.log('data::::::', data);
  for (const index in data.appointments) {
    const item = data.appointments[index];

    // console.log(
    //   'moment',
    //   moment(item.appointment_time).format('YYYY-MM-DD HH:mm')
    // );

    const newParam = {
      ...param,
      employeeId: item.store_employee,
      date: item.appointment_time,
    };

    const tenantConfig = await getTenantConfig(param.tenant);
    const shopWorkDays = tenantConfig.shop_schedule;

    if (shopWorkDays && shopWorkDays.length) {
      const dayName = moment(newParam.date).format('dddd');
      const dayFind = shopWorkDays.find((findItem) => findItem.day === dayName);

      if (!dayFind) {
        result.hasError = true;
        result.message = `Today shop is closed`;
        return result;
      }
    }

    const holidayEvents = await knex.raw(
      `
        SELECT * FROM tenant_event_holidays
        WHERE tenant = :tenant
        AND Date(:objDate) BETWEEN start_date::date AND end_date::date
      `,
      {
        tenant: newParam.tenant,
        objDate: moment(newParam.date).format('YYYY-MM-DD'),
      }
    );

    if (holidayEvents.rows.length) {
      result.hasError = true;
      result.message = `Today shop is closed`;
      return result;
    }

    if (await employeeModel.leaveManagement(newParam)) {
      result.hasError = true;
      result.message = `Holiday this date ${item.appointment_time}`;
      return result;
    }

    // console.log('*********************************');
    // console.log('index::::::::::::::', index);

    const employeeSchedule = await knex(MODULE.STORE.EMPLOYEE_SCHEDULE)
      .where({
        store_employee: item.store_employee,
        work_day: moment(item.appointment_time).format('dddd'),
      })
      .first();

    if (!employeeSchedule) {
      throw new Error('Employee schedule is not matched');
    }
    const storeEmployeeService = await knex(MODULE.STORE.EMPLOYEE_SERVICE)
      .where({
        store_employee: item.store_employee,
        store_service_category_item: item.store_service_category_item,
      })
      .first();

    const employeeStartTime = moment(employeeSchedule.start_time).format(
      'HH:mm'
    );
    const employeeEndTime = moment(employeeSchedule.end_time).format('HH:mm');
    const createAppTime = moment(item.appointment_time).format('HH:mm');
    const convertCreateAppTime = moment(item.appointment_time)
      .add(storeEmployeeService.service_time, 'minute')
      .format('HH:mm');

    // console.log('Time', createAppTime, convertCreateAppTime);
    if (createAppTime < employeeStartTime && createAppTime > employeeEndTime) {
      result.hasError = true;
      result.message =
        'Appointment time do not matched in Employee schedule time';
      return result;
    }

    const appointment = await knex.raw(
      `SELECT * FROM store_appointment 
          WHERE store_employee=:storeEmployee AND status::text = :status AND appointment_time::date = date(:appointmentDate) ORDER BY appointment_time ASC`,
      {
        storeEmployee: item.store_employee,
        status: APPOINTMENT_STATUS.NEW,
        appointmentDate: moment(item.appointment_time).format('YYYY-MM-DD'),
      }
    );

    if (appointment.rows.length > 0 || newAppointmentArr.length > 0) {
      // console.log('newAppointmentArr::::::::', newAppointmentArr);
      if (newAppointmentArr.length > 0) {
        newAppointmentArr.forEach((filterItem) => {
          if (filterItem.store_employee === item.store_employee) {
            appointment.rows.push(filterItem);
          }
        });

        // console.log('filterArr::::::', filterArr);
        // appointment.rows.push(filterArr);
      }

      // console.log('appointment.rows.length::::::', appointment.rows.length);
      // console.log('appointment.rows::::::::', appointment.rows);

      for (const key in appointment.rows) {
        const appointmentItem = appointment.rows[key];
        const appointmentTime = moment(appointmentItem.appointment_time).format(
          'HH:mm'
        );
        const convertAppointmentTime = moment(appointmentItem.appointment_time)
          .add(appointmentItem.service_time, 'minute')
          .format('HH:mm');
        let prevTime = employeeStartTime;

        // console.log('createAppTime', createAppTime);
        // console.log('convertCreateAppTime', convertCreateAppTime);
        // console.log('===============');
        // console.log('createAppTime', createAppTime);
        // console.log('prevTime', prevTime);
        // console.log('convertCreateAppTime', convertCreateAppTime);
        // console.log('appointmentTime', appointmentTime);

        if (createAppTime > convertAppointmentTime) {
          // console.log('1');
          prevTime = convertAppointmentTime;
        } else if (
          createAppTime < prevTime &&
          convertCreateAppTime >= appointmentTime
        ) {
          // console.log('3');
          result.hasError = true;
          result.message = `Appointment ${createAppTime} to ${convertCreateAppTime} is overlapping the booking on ${appointmentTime} to ${convertAppointmentTime}`;
          return result;
        }
      }
    }

    const newData = {
      note: data.note,
      name: data.name,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      store_service_category: item.store_service_category,
      store_service_category_item: item.store_service_category_item,
      store_employee: item.store_employee,
      appointment_time: item.appointment_time,
      status: APPOINTMENT_STATUS.NEW,
      service_time: Number(storeEmployeeService.service_time),
    };
    newAppointmentArr.push(newData);

    // console.log('appointment:::::', appointment.rows);
    // console.log('item::::::::', item);
    // console.log('chekStoreEmployeeService::::::::', chekStoreEmployeeService);
  }

  return result;
};

const appointmentCount = async (time, tenant) => {
  const month = moment(time).format('MM');
  const year = moment(time).format('YYYY');
  const appointmentCountResult = await knex.raw(
    `
    SELECT count(id) as count
    FROM store_appointment
    WHERE
    tenant = ?
    AND EXTRACT('year' FROM store_appointment.appointment_time) = ?
    AND EXTRACT('month' FROM store_appointment.appointment_time) = ?;
  `,
    [tenant, year, month]
  );
  return appointmentCountResult.rows[0].count;
};

const create = async (param, data) => {
  const transaction = await knex.transaction();
  try {
    if (!data.appointments.length) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `No appointmentdata is provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const checkAppointmentService = await checkAppointment(param, data);
    // console.log('checkAppointmentService:::::::::', checkAppointmentService);
    if (checkAppointmentService.hasError) {
      await transaction.rollback();
      const newError = new Error(`No Appointment Create`);
      newError.detail = checkAppointmentService.message;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    // return;
    const tenantFind = await knex(MODULE.TENANT)
      .where('id', param.tenantId)
      .first();
    const tenantConfigFind = await knex(MODULE.TENANT_CONFIG)
      .where('id', tenantFind.tenant_config)
      .first();
    const gstPercentage = tenantConfigFind.gst_percentage;
    const code = generateRandomString();
    const storeAppointmentQueryPromise = data.appointments.map(
      async (item, index) => {
        const newNumber = await appointmentCount(
          item.appointment_time,
          param.tenantId
        );

        const storeEmployeeService = await knex(MODULE.STORE.EMPLOYEE_SERVICE)
          .where({
            store_employee: item.store_employee,
            store_service_category_item: item.store_service_category_item,
          })
          .first();

        const storeServiceCategoryItem = await knex(
          MODULE.STORE.SERVICE_CATEGORY_ITEM
        )
          .where('id', item.store_service_category_item)
          .first();

        const newData = {
          note: data.note,
          name: data.name,
          gender: data.gender,
          phone: data.phone,
          email: data.email,
          store_service_category: item.store_service_category,
          store_service_category_item: item.store_service_category_item,
          store_employee: item.store_employee,
          appointment_time: item.appointment_time,
          status: APPOINTMENT_STATUS.NEW,
          appointment_number: Number(newNumber) + index + 1,
          tenant: param.tenantId,
          created_by: param.userId,
          updated_by: param.userId,
          service_time: Number(storeEmployeeService.service_time),
          app_user: param.userId,
          code,
        };

        // console.log('item::::::', item);
        // console.log('storeServiceCategoryItem::::::', storeServiceCategoryItem);

        const totalAmount = Number(storeServiceCategoryItem.price);
        const gstAmount = totalAmount * (gstPercentage / 100);
        const discountAmount = 0;
        const grandTotal = gstAmount + totalAmount;

        newData.total_amount = totalAmount;
        newData.gst_percentage = gstPercentage;
        newData.discount_amount = discountAmount;
        newData.gst_amount = gstAmount;
        newData.grand_total_amount = grandTotal;

        return transaction(MODULE.STORE.APPOINTMENT)
          .insert(newData)
          .returning('*');
      }
    );

    const storeAppointment = await Promise.all(storeAppointmentQueryPromise);
    // console.log(storeAppointment);

    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return storeAppointment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const reSchedule = async (param, data) => {
  const findAppointment = knex(MODULE.STORE.APPOINTMENT)
    .where('id', param.storeAppointment)
    .first();
  if (findAppointment.status === APPOINTMENT_STATUS.NEW) {
    const [appointment] = knex(MODULE.STORE.APPOINTMENT)
      .update({ status: APPOINTMENT_STATUS.RESCHEDULE })
      .where('id', param.storeAppointment)
      .returning('*');

    if (!appointment) {
      const newError = new Error(`Commit`);
      newError.detail = `Re-schedule service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
  }
  return create(param, data);
};

const ratinglist = async (param) =>
  knex
    .select(
      'ser.*',
      knex.raw(`json_agg(sa.*) -> 0 as store_appointment`),
      knex.raw(`json_agg(se.*) -> 0 as store_employee`),
      knex.raw(`json_agg(ssci.*) -> 0 as store_service_category_item`)
    )
    .from(`${MODULE.STORE.EMPLOYEE_RATING} as ser`)
    .leftJoin(
      `${MODULE.STORE.APPOINTMENT} as sa`,
      'sa.id',
      'ser.store_appointment'
    )
    .leftJoin(`${MODULE.STORE.EMPLOYEE} as se`, 'se.id', 'ser.store_employee')
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .where('ser.status', RATING_STATUS.PENDING)
    .where('ser.app_user', param.userId)
    .where('ser.is_deleted', false)
    .groupBy('ser.id');

const rating = async (param, data) => {
  const [ratingUpdate] = await knex(MODULE.STORE.EMPLOYEE_RATING)
    .update(data)
    .where('id', param.storeEmployeeRating)
    .returning('*');

  return ratingUpdate;
};

const leaveManagement = async (param) => {
  const employeeLeaveQuery = await knex.raw(
    `SELECT * FROM ${MODULE.STORE.EMPLOYEE_LEAVE} 
      WHERE store_employee = :storeEmployee
      AND status = :status
      AND (from_date::date >= DATE(:setDate) AND to_date::date <= DATE(:setDate))`,
    {
      storeEmployee: param.employeeId,
      status: LEAVE_STATUS.APPROVED,
      setDate: moment(param.date).format('YYYY-MM-DD'),
    }
  );

  const [employeeLeave] = employeeLeaveQuery.rows;

  if (employeeLeave) {
    return true;
  }

  const officeHoliday = await knex(MODULE.SHOP_EVENT_HOLIDAYS)
    .where({
      tenant: param.tenantId,
      is_deleted: false,
    })
    .where((qb) => {
      qb.orWhere('start_date', moment(param.date).format('YYYY-MM-DD'));
      qb.orWhere('end_date', moment(param.date).format('YYYY-MM-DD'));
    })
    .first();

  if (officeHoliday) {
    return true;
  }

  return false;
};
const leaveManagementForEmployees = async (param) => {
  const employeeLeaveQuery = await knex(MODULE.STORE.EMPLOYEE_LEAVE)
    .select('*')
    .whereIn('store_employee', param.employeeId)
    .andWhere('status', LEAVE_STATUS.APPROVED)
    .andWhere(() => {
      this.whereRaw('from_date::date <= ?', [
        moment(param.date).format('YYYY-MM-DD'),
      ]).andWhereRaw('to_date::date >= ?', [
        moment(param.date).format('YYYY-MM-DD'),
      ]);
    });

  const [employeeLeave] = employeeLeaveQuery;

  if (employeeLeave) {
    return true;
  }

  const officeHoliday = await knex(MODULE.SHOP_EVENT_HOLIDAYS)
    .where({
      tenant: param.tenantId,
      is_deleted: false,
    })
    .where((qb) => {
      qb.orWhere('start_date', moment(param.date).format('YYYY-MM-DD'));
      qb.orWhere('end_date', moment(param.date).format('YYYY-MM-DD'));
    })
    .first();

  if (officeHoliday) {
    return true;
  }

  return false;
};

const appointmentUsers = async (param) => {
  const appointments = await knex.raw(
    `
    SELECT * FROM ${MODULE.STORE.APPOINTMENT} 
    WHERE tenant=:tenant 
    AND app_user=:appUser
    AND appointment_time::date = DATE(:appointmentDate)
  `,
    {
      tenant: param.tenantId,
      appUser: param.userId,
      appointmentDate: moment(param.date).format('YYYY-MM-DD'),
    }
  );
  return appointments.rows;
};

const userAppointmentsByDates = async (param) => {
  // Ensure dates are formatted to 'YYYY-MM-DD'
  const formattedDates = param.dates.map((date) =>
    moment(date).format('YYYY-MM-DD')
  );

  // Construct the query using knex query builder
  const query = knex(MODULE.STORE.APPOINTMENT)
    .select('*')
    .where('tenant', param.tenantId)
    .where('app_user', param.userId)
    .whereIn(knex.raw('appointment_time::date'), formattedDates);

  // Execute the query
  const appointments = await query;

  return appointments;
};

async function storePayFastLogs(log) {
  const completed = await knex.from(MODULE.APP.PAY_FAST_LOGS).insert({ log });
  if (completed) {
    return true;
  }
  return false;
}

async function orderStatusUpdatePayFast(code) {
  return knex(MODULE.APP.ORDER)
    .where('code', code)
    .update({ payment_status: PAYMENT_STATUS.PAID });
}

module.exports = {
  providerDetailById,
  categories,
  categoryItems,
  serviceProviders,
  create,
  list,
  ratinglist,
  rating,
  reSchedule,
  leaveManagement,
  appointmentUsers,
  storePayFastLogs,
  leaveManagementForEmployees,
  userAppointmentsByDates,
  orderStatusUpdatePayFast,
  serviceCategoryItem,
};
