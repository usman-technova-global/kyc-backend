/* eslint-disable no-param-reassign */
const moment = require('moment');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  RATING_STATUS,
  LEAVE_STATUS,
  APPOINTMENT_STATUS,
  EXPENSE_TYPE,
} = require('../../../../utils/constants/enumConstants');
const { getTenantConfig } = require('../../../../utils/commonUtil');

const STORE_EMPLOYEE_SCHEDULE_LIMIT = 7;

const list = async (param) => {
  const query = knex
    .from(MODULE.STORE.EMPLOYEE)
    .whereRaw('tenant = ?', [param.tenant])
    .whereRaw('is_deleted = ?', [false])
    .whereRaw('is_active = ?', [true])
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder
          .orWhereRaw('name ILIKE ?', [`%${param.search}%`])
          .orWhereRaw('email ILIKE ?', [`%${param.search}%`])
          .orWhereRaw('phone ILIKE ?', [`%${param.search}%`]);
      }
    });

  const filteredQuery = query
    .clone()
    .select('*')
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

  const multiQuery = [query.clone().count(), filteredQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  const employeeList = totalList.map(async (item) => {
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

  return {
    totalList: promiseQuery,
    total: total.count,
  };
};

const employeeListService = async (param) => {
  const query = knex
    .from(MODULE.STORE.EMPLOYEE)
    .whereRaw('tenant = ?', [param.tenant])
    .whereRaw('is_deleted = ?', [false])
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder
          .orWhereRaw('name ILIKE ?', [`%${param.search}%`])
          .orWhereRaw('email ILIKE ?', [`%${param.search}%`])
          .orWhereRaw('phone ILIKE ?', [`%${param.search}%`]);
      }
    });

  const filteredQuery = query
    .clone()
    .select('*')
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

  const multiQuery = [query.clone().count(), filteredQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  const employeeList = totalList.map(async (item) => {
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

  return {
    totalList: promiseQuery,
    total: total.count,
  };
};

const timingCheck = async (param, employeeStartTime, employeeEndTime) => {
  const tenantConfig = await getTenantConfig(param.tenant);
  const currentDate = moment();
  const shopStartTime = moment(tenantConfig.office_time_in)
    .set('year', currentDate.year())
    .set('month', currentDate.month())
    .set('date', currentDate.date());

  let shopEndTime = moment(tenantConfig.office_time_out)
    .set('year', currentDate.year())
    .set('month', currentDate.month())
    .set('date', currentDate.date());
  if (shopEndTime.hour() < shopStartTime.hour()) {
    shopEndTime = shopEndTime.add(1, 'day');
  }
  const selectStartTime = moment(employeeStartTime)
    .set('year', currentDate.year())
    .set('month', currentDate.month())
    .set('date', currentDate.date());
  let selectEndTime = moment(employeeEndTime)
    .set('year', currentDate.year())
    .set('month', currentDate.month())
    .set('date', currentDate.date());
  if (selectEndTime.hour() < selectStartTime.hour()) {
    selectEndTime = selectEndTime.add(1, 'day');
  }

  if (
    selectStartTime.isBefore(shopStartTime) ||
    selectEndTime.isAfter(shopEndTime)
  ) {
    return false;
  }
  return true;
};

const create = async (param, data) => {
  const transaction = await knex.transaction();
  try {
    if (!(await timingCheck(param, data.start_time, data.end_time))) {
      const newError = new Error(`Shop closed during selected time`);
      newError.detail = `Shop closed during selected time`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // console.log('data:::::::', data);
    const storeEmployeeData = {
      name: data.name,
      password: data.password,
      dob: data.dob,
      note: data.note,
      address: data.address,
      phone: data.phone,
      cnic: data.cnic,
      email: data.email,
      avatar: data.avatar,
      payroll_type: data.payroll_type,
      salary: data.salary,
      is_active: true,
      tenant: param.tenant,
      created_by: param.userId,
      updated_by: param.userId,
    };

    // console.log('storeEmployeeData::::', storeEmployeeData);
    // return;
    const [storeEmployee] = await transaction(MODULE.STORE.EMPLOYEE)
      .insert(storeEmployeeData)
      .returning('*');

    if (!storeEmployee) {
      await transaction.rollback();
      const newError = new Error(`No Store Employee`);
      newError.detail = `Store employee database service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // console.log('data.services:::::', data.services);
    let storeEmployeeService = null;
    if (data.services && data.services.length) {
      const services = data.services.map((item) => {
        const newData = {
          store_employee: storeEmployee.id,
          is_active: true,
          created_by: param.userId,
          updated_by: param.userId,
          ...item,
        };
        return newData;
      });

      storeEmployeeService = await transaction(MODULE.STORE.EMPLOYEE_SERVICE)
        .insert(services)
        .returning('*');

      if (!storeEmployeeService.length) {
        await transaction.rollback();
        const newError = new Error(`No Store Employee Service`);
        newError.detail = `Store employee service database service is not execute`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    const schedule = data.work_days.map((item) => {
      const newData = {
        store_employee: storeEmployee.id,
        work_day: item,
        is_active: true,
        start_time: data.start_time,
        end_time: data.end_time,
        created_by: param.userId,
        updated_by: param.userId,
      };
      return newData;
    });

    const storeEmployeeSchedule = await transaction(
      MODULE.STORE.EMPLOYEE_SCHEDULE
    )
      .insert(schedule)
      .returning('*');

    if (!storeEmployeeSchedule.length) {
      await transaction.rollback();
      const newError = new Error(`No Store Employee Schedule`);
      newError.detail = `Store employee schedule database service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // const startTime = moment(newBody.startTime).format('YYYY-MM-DD HH:mm:ss');
    // const endTime = moment(newBody.endTime).format('YYYY-MM-DD HH:mm:ss');

    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return {
      ...storeEmployee,
      rating: 0,
      services: storeEmployeeService,
      work_days: storeEmployeeSchedule,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findById = (id) => knex(MODULE.STORE.EMPLOYEE).where('id', id).first();

const findStoreEmployeeById = async (param) =>
  knex
    .select([
      'se.*',
      knex.raw(
        `(SELECT json_agg(ses_with_ssci)
          FROM (
            SELECT ses.*,
            json_agg(ssci.*) -> 0 AS store_service_category_item
            FROM ${MODULE.STORE.EMPLOYEE_SERVICE} AS ses
            LEFT JOIN ${MODULE.STORE.SERVICE_CATEGORY_ITEM} AS ssci
            ON ssci.id = ses.store_service_category_item
            WHERE ses.store_employee = se.id
            AND ses.is_active = true
            AND ses.is_deleted = false
            GROUP BY ses.id
          ) AS ses_with_ssci
        ) AS services`
      ),
    ])
    .from(`${MODULE.STORE.EMPLOYEE} as se`)
    .where({ 'se.id': param.employeeId })
    .groupBy('se.id')
    .first();

const update = async (param, data) => {
  const transaction = await knex.transaction();
  try {
    const findEmployee = await transaction(MODULE.STORE.EMPLOYEE)
      .where('id', param.employeeId)
      .first();

    if (data.deleted_ids.length) {
      const deleted = await transaction(MODULE.STORE.EMPLOYEE_SERVICE)
        .update({
          is_active: false,
          is_deleted: true,
        })
        .whereIn('id', data.deleted_ids)
        .returning('*');

      if (deleted.length <= 0) {
        await transaction.rollback();
        const newError = new Error(`No Store Employee Service Delete`);
        newError.detail = `Store Employee Service is not deleted`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    const storeEmployeeData = {
      name: data.name,
      dob: data.dob,
      note: data.note,
      address: data.address,
      payroll_type: data.payroll_type,
      salary: data.salary,
      avatar: data.avatar,
      updated_by: param.userId,
      updated_date: new Date(),
    };

    if (data.password) storeEmployeeData.password = data.password;

    if (findEmployee.phone !== data.phone || findEmployee.cnic !== data.cnic) {
      const checkConstraintPhone = await transaction(MODULE.STORE.EMPLOYEE)
        .where('phone', data.phone)
        .whereNot('id', param.employeeId)
        .first();
      if (!checkConstraintPhone) {
        storeEmployeeData.phone = data.phone;
      }
      const checkConstraintCnic = await transaction(MODULE.STORE.EMPLOYEE)
        .where('cnic', data.cnic)
        .whereNot('id', param.employeeId)
        .first();
      if (!checkConstraintCnic) {
        storeEmployeeData.cnic = data.cnic;
      }
    }

    const [storeEmployee] = await transaction(MODULE.STORE.EMPLOYEE)
      .update(storeEmployeeData)
      .where('id', param.employeeId)
      .returning('*');

    if (!storeEmployee) {
      await transaction.rollback();
      const newError = new Error(`No Store Employee`);
      newError.detail = `Store employee database service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const storeEmployeeServiceQery = [];
    let storeEmployeeService;

    if (data.services && data.services.length) {
      data.services.forEach((item) => {
        if (item.id) {
          const query = transaction(MODULE.STORE.EMPLOYEE_SERVICE)
            .update(item)
            .where('id', item.id)
            .returning('*');

          storeEmployeeServiceQery.push(query);
        } else {
          const newData = {
            store_employee: storeEmployee.id,
            is_active: true,
            created_by: param.userId,
            updated_by: param.userId,
            ...item,
          };
          const query = transaction(MODULE.STORE.EMPLOYEE_SERVICE)
            .insert(newData)
            .returning('*');
          storeEmployeeServiceQery.push(query);
        }
      });

      const multiQuery = storeEmployeeServiceQery.join(';');

      const rawResults = await transaction.raw(multiQuery);

      if (Array.isArray(rawResults)) {
        storeEmployeeService = rawResults.map((rawResult) => {
          const [row] = rawResult.rows;
          return row;
        });
      } else {
        const [row] = rawResults.rows;
        storeEmployeeService = [row];
      }
    }

    // console.log({
    //   ...storeEmployee,
    //   services: storeEmployeeService,
    // });

    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return {
      ...storeEmployee,
      services: storeEmployeeService,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateStatus = (data, id) =>
  knex(MODULE.STORE.EMPLOYEE).update(data).where('id', id).returning('*');

const storeEmployeeServiceList = (employeeId) =>
  knex
    .select([
      'ses.*',
      knex.raw(`json_agg(ssci.*) -> 0 AS store_service_category_item`),
    ])
    .from(`${MODULE.STORE.EMPLOYEE_SERVICE} as ses`)
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'ses.store_service_category_item'
    )
    .where({
      'ses.store_employee': employeeId,
      'ses.is_deleted': false,
    })
    .groupBy('ses.id');

const employeeServiceLov = (employeeId) =>
  knex
    .select(
      'es.*',
      knex.raw(`json_agg(sci.*) -> 0 AS store_service_category_item`)
    )
    .from(`${MODULE.STORE.EMPLOYEE_SERVICE} as es`)
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as sci`,
      'sci.id',
      'es.store_service_category_item'
    )
    .where({
      'es.store_employee': employeeId,
      'es.is_active': true,
      'es.is_deleted': false,
    })
    .groupBy('es.id');

const employeeLov = (param) =>
  knex(MODULE.STORE.EMPLOYEE)
    .where({
      tenant: param.tenant,
      is_active: true,
      is_deleted: false,
    })
    .orderBy('created_date', 'desc');

const storeEmployeeServiceCreate = async (param, data) => {
  if (data.length) {
    const newData = data.map((item) => ({
      store_employee: param.employeeId,
      store_service_category_item: item.store_service_category_item,
      service_time: item.service_time,
      amount_type: item.amount_type,
      amount: item.amount,
      is_active: true,
      created_by: param.userId,
      updated_by: param.userId,
    }));

    const employeeServiceCreate = await knex(MODULE.STORE.EMPLOYEE_SERVICE)
      .insert(newData)
      .returning('*');
    if (!employeeServiceCreate.length) {
      const newError = new Error(`No Employee Service`);
      newError.detail = `Employee service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const ids = employeeServiceCreate.map((item) => item.id);
    const returnData = await knex
      .select(
        'es.*',
        knex.raw(`json_agg(sci.*) -> 0 AS store_service_category_item`)
      )
      .from(`${MODULE.STORE.EMPLOYEE_SERVICE} as es`)
      .leftJoin(
        `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as sci`,
        'sci.id',
        'es.store_service_category_item'
      )
      .whereIn('es.id', ids)
      .groupBy('es.id');

    return returnData;
  }
  const newError = new Error(`No Employee Service`);
  newError.detail = `Employee service is not execute`;
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
  // const [employeeServiceCreate] = await knex(MODULE.STORE.EMPLOYEE_SERVICE)
  //   .insert({
  //     store_employee: param.employeeId,
  //     store_service_category_item: data.store_service_category_item,
  //     service_time: data.service_time,
  //     amount_type: data.amount_type,
  //     amount: data.amount,
  //     is_active: true,
  //     created_by: param.userId,
  //     updated_by: param.userId,
  //   })
  //   .returning('*');

  // if (!employeeServiceCreate) {
  //   const newError = new Error(`No Employee Service`);
  //   newError.detail = `Employee service is not execute`;
  //   newError.code = HTTP_STATUS.BAD_REQUEST;
  //   throw newError;
  // }

  // const storeServiceCategoryItem = await knex(
  //   MODULE.STORE.SERVICE_CATEGORY_ITEM
  // )
  //   .where('id', data.store_service_category_item)
  //   .first();

  // return {
  //   ...employeeServiceCreate,
  //   storeServiceCategoryItem,
  // };
};

const findServiceById = (id) =>
  knex(MODULE.STORE.EMPLOYEE_SERVICE).where('id', id).first();

const storeEmployeeServiceUpdate = async (param, data) => {
  const [employeeServiceUpdate] = await knex(MODULE.STORE.EMPLOYEE_SERVICE)
    .update({
      store_service_category_item: data.store_service_category_item,
      service_time: data.service_time,
      amount_type: data.amount_type,
      amount: data.amount,
      updated_by: param.userId,
    })
    .where('id', param.serviceId)
    .returning('*');

  if (!employeeServiceUpdate) {
    const newError = new Error(`No Employee Service`);
    newError.detail = `Employee service is not execute`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const storeServiceCategoryItem = await knex(
    MODULE.STORE.SERVICE_CATEGORY_ITEM
  )
    .where('id', data.store_service_category_item)
    .first();

  return {
    ...employeeServiceUpdate,
    storeServiceCategoryItem,
  };
};

const storeEmployeeServiceUpdateStatus = (id, data) =>
  knex(MODULE.STORE.EMPLOYEE_SERVICE)
    .update(data)
    .where('id', id)
    .returning('*');

const storeEmployeeScheduleList = (employeeId) =>
  knex
    .select([
      'se.*',
      knex.raw(`
      CASE
        WHEN count(ses.*) = 0 THEN '[]'::json
        ELSE json_agg(ses.*)
      END AS store_employee_schedule
    `),
    ])
    .from(`${MODULE.STORE.EMPLOYEE} as se`)
    .leftJoin(
      `${MODULE.STORE.EMPLOYEE_SCHEDULE} as ses`,
      'ses.store_employee',
      'se.id'
    )
    .where({ 'se.id': employeeId })
    .groupBy('se.id')
    .first();

const storeEmployeeScheduleCreate = async (param, data) => {
  const checkIsScheduled = await knex(MODULE.STORE.EMPLOYEE_SCHEDULE).where({
    store_employee: param.employeeId,
    is_deleted: false,
  });

  if (
    checkIsScheduled &&
    checkIsScheduled.length >= STORE_EMPLOYEE_SCHEDULE_LIMIT
  ) {
    const newError = new Error(`No Store Employee Schedule`);
    newError.detail = `Store employee schedule exceed the limit`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const newArrPromises = data.work_days.map(async (item) => {
    if (!(await timingCheck(param, item.start_time, item.end_time))) {
      const newError = new Error(`Shop closed during selected time`);
      newError.detail = `Shop closed during selected time`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return {
      store_employee: param.employeeId,
      work_day: item.day,
      start_time: item.start_time,
      end_time: item.end_time,
      is_active: true,
      created_by: param.userId,
      updated_by: param.userId,
    };
  });

  const newArr = await Promise.all(newArrPromises);

  return knex(MODULE.STORE.EMPLOYEE_SCHEDULE).insert(newArr).returning('*');
};

const findScheduleById = (id) =>
  knex(MODULE.STORE.EMPLOYEE_SCHEDULE).where('id', id).first();

const storeEmployeeScheduleUpdate = async (param, data) => {
  if (!(await timingCheck(param, data.start_time, data.end_time))) {
    const newError = new Error(`Shop closed during selected time`);
    newError.detail = `Shop closed during selected time`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  return knex(MODULE.STORE.EMPLOYEE_SCHEDULE)
    .update(data)
    .where('id', param.scheduleId)
    .returning('*');
};

const storeEmployeeScheduleStatusUpdate = async (id, data) =>
  knex(MODULE.STORE.EMPLOYEE_SCHEDULE)
    .update(data)
    .where('id', id)
    .returning('*');

const attendanceList = async (param) => {
  const inputDate = moment(param.date); // Input date
  const startDate = inputDate.clone().startOf('month'); // Start of the month
  const endDate = inputDate.clone().endOf('month'); // End of the month

  // console.log(startDate.format('YYYY-MM-DD')); // Output: 2024-04-01
  // console.log(endDate.format('YYYY-MM-DD')); // Output: 2024-04-30

  // // const monthName = param.month;
  // // const startDate = moment(monthName, 'MMMM').startOf('month');
  // // const endDate = moment(startDate).endOf('month');

  const employee = await knex(MODULE.STORE.EMPLOYEE)
    .where('id', param.employeeId)
    .first();

  const employeeQuery = await knex.raw(
    `SELECT *
    FROM store_employee_attendance
    WHERE store_employee = :storeEmployee
    AND attendance_date >= :startDate
    AND attendance_date <= :endDate
    ORDER BY attendance_date ASC
    `,
    {
      storeEmployee: param.employeeId,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    }
  );

  const leaveQuery = await knex.raw(
    `SELECT *
    FROM store_employee_leave
    WHERE store_employee = :storeEmployee
    AND (from_date >= date(:startDate) OR to_date <= date(:endDate))
    `,
    {
      storeEmployee: param.employeeId,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      endDate: moment(endDate).format('YYYY-MM-DD'),
    }
  );

  employee.attendance = employeeQuery.rows;
  employee.leave = leaveQuery.rows;

  return employee;
};

const leave = async (param) => {
  const leaveQuery = knex
    .from(`${MODULE.STORE.EMPLOYEE_LEAVE} as el`)
    .where('el.tenant', param.tenant);

  const totalLeaveQuery = leaveQuery.clone().count();

  const filteredLeaveQuery = leaveQuery
    .clone()
    .select([
      'el.*',
      knex.raw(`json_agg(se.*) -> 0 AS store_employee`),
      knex.raw(`
        CASE
          WHEN count(ela.*) = 0 THEN '[]'::json
          ELSE json_agg(ela.*)
        END AS store_employee_leave_attachment
      `),
    ])
    .leftJoin(`${MODULE.STORE.EMPLOYEE} as se`, 'se.id', 'el.store_employee')
    .leftJoin(
      `${MODULE.STORE.EMPLOYEE_LEAVE_ATTACHMENT} as ela`,
      'ela.store_employee_leave',
      'el.id'
    )
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder
          .whereRaw('se.email::text ILIKE ?', [`%${param.search}%`])
          .orWhereRaw('se.name::text ILIKE ?', [`%${param.search}%`]);
      }
    })
    .groupBy('el.id')
    .orderBy('created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [totalLeaveQuery, filteredLeaveQuery].join(';');

  const [
    {
      rows: [totalLeaves],
    },
    { rows: leaves },
  ] = await knex.raw(multiQuery);

  let page = 0;
  if (Number(totalLeaves.count) > 0) {
    page = param.page;
  }
  return {
    leaves,
    page,
    perPage: param.limit,
    totalPages: Math.ceil(Number(totalLeaves.count) / param.size),
    totalResults: Number(totalLeaves.count),
  };
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
      tenant: param.tenant,
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

const detail = async (param) => {
  const employee = await knex(MODULE.STORE.EMPLOYEE)
    .where('id', param.employeeId)
    .first();

  const services = await knex
    .select(
      'ses.*',
      knex.raw(`json_agg(ssci.*) -> 0 as store_service_category_item`)
    )
    .from(`${MODULE.STORE.EMPLOYEE_SERVICE} as ses`)
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'ses.store_service_category_item'
    )
    .where('ses.store_employee', employee.id)
    .groupBy('ses.id');

  employee.services = services;

  return employee;
};

const reviews = async (param) => {
  const query = knex(MODULE.STORE.EMPLOYEE_RATING).where({
    'store_employee_rating.store_employee': param.employeeId,
    'store_employee_rating.is_deleted': false,
    'store_employee_rating.status': RATING_STATUS.COMPLETED,
  });

  const queryList = query
    .clone()
    .select(
      'store_employee_rating.*',
      knex.raw(`json_agg(sa.*) -> 0 as store_appointment`),
      knex.raw(`json_agg(ses.*) -> 0 as store_employee_service`),
      knex.raw(`json_agg(ssci.*) -> 0 as store_service_category_item`)
    )
    .leftJoin(
      `${MODULE.STORE.APPOINTMENT} as sa`,
      'sa.id',
      'store_employee_rating.store_appointment'
    )
    .leftJoin(`${MODULE.STORE.EMPLOYEE_SERVICE} as ses`, (db) => {
      db.on('ses.store_employee', '=', 'sa.store_employee').andOn(
        'ses.store_service_category_item',
        '=',
        'sa.store_service_category_item'
      );
    })
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .where('store_employee_rating.store_employee', param.employeeId)
    .groupBy('store_employee_rating.id')
    .orderBy('store_employee_rating.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: parseInt(total.count, 10),
  };
};

const distinctStarList = async (param) => {
  const stars = [
    { star: 0, total: 0 },
    { star: 1, total: 0 },
    { star: 2, total: 0 },
    { star: 3, total: 0 },
    { star: 4, total: 0 },
    { star: 5, total: 0 },
  ];

  const query = knex(MODULE.STORE.EMPLOYEE_RATING).where({
    store_employee: param.employeeId,
    'store_employee_rating.is_deleted': false,
    'store_employee_rating.status': RATING_STATUS.COMPLETED,
  });

  const sumStars = query.clone().sum('star');

  const starQuery = query
    .clone()
    .distinct('store_employee_rating.star')
    .select(knex.raw(`sum(store_employee_rating.star) as total`))
    .groupBy('store_employee_rating.star');

  const multiQuery = [sumStars, starQuery].join(';');

  const [{ rows: totalStars }, { rows: starList }] = await knex.raw(multiQuery);

  return {
    totalStars: parseInt(totalStars[0].sum, 10),
    starList: stars.map((item) => {
      const foundItem = starList.find((item2) => item2.star === item.star);
      if (foundItem) {
        return { star: foundItem.star, total: parseInt(foundItem.total, 10) };
      }
      return item;
    }),
  };
};

const leaveManagementUpdateStatus = async (param, data) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm');
  const [employeeLeave] = await knex(MODULE.STORE.EMPLOYEE_LEAVE)
    .update(data)
    .where('id', param.storeEmployeeLeave)
    .returning('*');

  if (
    employeeLeave &&
    data.status === LEAVE_STATUS.APPROVED &&
    !employeeLeave.half_day
  ) {
    // const findAppointment2 = knex.raw(
    //   `SELECT * FROM ${MODULE.STORE.APPOINTMENT} WHERE store_employee = :storeEmployee AND appointment_time::date = DATE(:currentTime)`,
    //   {
    //     storeEmployee: employeeLeave.store_employee,
    //     currentTime,
    //   }
    // );

    const findAppointment = knex.raw(
      `
        SELECT * FROM ${MODULE.STORE.APPOINTMENT}
        WHERE store_employee = :storeEmployee
        AND appointment_time::date >= DATE(:fromDate)
        AND appointment_time::date <= DATE(:toDate)
      `,
      {
        storeEmployee: employeeLeave.store_employee,
        fromDate: employeeLeave.from_date,
        toDate: employeeLeave.to_date,
      }
    );

    const newArr = [];
    if (findAppointment.length > 0) {
      findAppointment.forEach((item) => {
        if (moment(item.appointment_time).isAfter(currentTime, 'minute')) {
          newArr.push(item.id);
        }
      });
      if (newArr.length) {
        await knex(MODULE.STORE.APPOINTMENT)
          .update({ status: APPOINTMENT_STATUS.CANCELLED })
          .whereIn(newArr);
      }
    }
  }

  return employeeLeave;
};

const expenseList = async (param) => {
  const query = knex(MODULE.EXPENSE)
    .where('tenant', param.tenant)
    .andWhere({ is_active: true, is_deleted: false })
    .andWhereRaw(`created_date::date BETWEEN DATE(:to) AND DATE(:from)`, {
      to: param.startDate,
      from: param.endDate,
    })
    .modify((db) => {
      if (param.expenseType !== EXPENSE_TYPE.NONE) {
        db.andWhere('expense_type', param.expenseType);
      }
    });

  const queryList = query
    .clone()
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: parseInt(total.count, 10),
  };
};

const expenseCreate = async (param, data) => {
  if (data.expense_details.length) {
    const newArr = data.expense_details.map(async (item) => ({
      tenant: param.tenant,
      expense_type: data.expense_type,
      expense_details: JSON.stringify(item),
      is_active: true,
      is_deleted: false,
      created_date: new Date(),
      updated_date: new Date(),
    }));
    const promiseArr = await Promise.all(newArr);
    const insertData = await knex(MODULE.EXPENSE)
      .insert(promiseArr)
      .returning('*');
    if (!insertData.length) {
      const newError = new Error(`Expense not created`);
      newError.detail = `Expense not created`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return insertData;
  }
  const newError = new Error(`Expense create data not found`);
  newError.detail = `Expense create data not found`;
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

module.exports = {
  list,
  create,
  findById,
  update,
  updateStatus,
  findStoreEmployeeById,
  storeEmployeeServiceList,
  storeEmployeeServiceCreate,
  findServiceById,
  storeEmployeeServiceUpdate,
  storeEmployeeServiceUpdateStatus,
  storeEmployeeScheduleList,
  storeEmployeeScheduleCreate,
  findScheduleById,
  storeEmployeeScheduleUpdate,
  attendanceList,
  leave,
  detail,
  reviews,
  distinctStarList,
  leaveManagement,
  leaveManagementUpdateStatus,
  employeeListService,
  employeeServiceLov,
  storeEmployeeScheduleStatusUpdate,
  expenseList,
  expenseCreate,
  employeeLov,
};
