/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
const moment = require('moment');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const employeeModel = require('../employee/employee.model');
// const {
//   prettyPrintJSON,
// } = require('../../../../utils/commonUtils/prettyPrintJSON');
const {
  generateRandomString,
  getTenantConfig,
} = require('../../../../utils/commonUtil');
const {
  APPOINTMENT_STATUS,
  RATING_STATUS,
} = require('../../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const weekly = async (param) => {
  moment.updateLocale('en', {
    week: {
      dow: 0, // Sunday
    },
  });
  // Define the week number you want to get the start and end dates for
  const weekNumber = param.week; // Change this to the desired week number
  // Get the start date of the week
  const startDateOfWeek = moment().isoWeek(weekNumber).startOf('week');
  // Get the end date of the week
  const endDateOfWeek = moment().isoWeek(weekNumber).endOf('week');
  // Format the start and end dates
  const formattedStartDateOfWeek = startDateOfWeek.format('YYYY-MM-DD');
  const formattedEndDateOfWeek = endDateOfWeek.format('YYYY-MM-DD');

  // const appointment = await knex.raw(
  //   ` SELECT sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,
  //     '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
  //     json_agg(ssci.*) -> 0 AS store_service_category_item
  //     FROM store_appointment as sa
  //     left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
  //     WHERE sa.tenant = :tenant
  //     AND sa.appointment_time::date >= DATE(:startDate)
  //     AND sa.appointment_time::date <= DATE(:endDate)
  //     GROUP BY sa.id;
  //   `,
  //   {
  //     tenant: param.tenant,
  //     startDate: formattedStartDateOfWeek,
  //     endDate: formattedEndDateOfWeek,
  //   }
  // );

  const appointment = await knex.raw(
    `
    SELECT DISTINCT ON (sa.code) sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,sa.code,sa.appointment_type,sa.guest_type,
    '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
    json_agg(ssci.*) -> 0 AS store_service_category_item
    FROM ${MODULE.STORE.APPOINTMENT} as sa
    left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
    WHERE sa.tenant = :tenant
    AND sa.appointment_time::date >= DATE(:startDate) 
    AND sa.appointment_time::date <= DATE(:endDate)
    GROUP BY sa.id
    ORDER BY sa.code DESC, sa.id ASC
    `,
    {
      tenant: param.tenant,
      startDate: formattedStartDateOfWeek,
      endDate: formattedEndDateOfWeek,
    }
  );

  return appointment.rows;
};

const distinctWeekly = async (param) => {
  moment.updateLocale('en', {
    week: {
      dow: 0, // Sunday
    },
  });
  // Define the week number you want to get the start and end dates for
  const weekNumber = param.week; // Change this to the desired week number
  // Get the start date of the week
  const startDateOfWeek = moment().isoWeek(weekNumber).startOf('week');
  // Get the end date of the week
  const endDateOfWeek = moment().isoWeek(weekNumber).endOf('week');
  // Format the start and end dates
  const formattedStartDateOfWeek = startDateOfWeek.format('YYYY-MM-DD');
  const formattedEndDateOfWeek = endDateOfWeek.format('YYYY-MM-DD');

  const appointment = await knex.raw(
    `
    SELECT DISTINCT ON (sa.code) sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,sa.code,sa.appointment_type,sa.guest_type,
    '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
    json_agg(ssci.*) -> 0 AS store_service_category_item
    FROM ${MODULE.STORE.APPOINTMENT} as sa
    left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
    WHERE sa.tenant = :tenant
    AND sa.guest_type = :guestType
    AND sa.appointment_time::date >= DATE(:startDate) 
    AND sa.appointment_time::date <= DATE(:endDate)
    GROUP BY sa.id
    ORDER BY sa.code DESC, sa.id ASC
    `,
    {
      tenant: param.tenant,
      guestType: 'Self',
      startDate: formattedStartDateOfWeek,
      endDate: formattedEndDateOfWeek,
    }
  );

  // console.log('appointment:::::::', appointment.rows);
  // console.log('appointment Length:::::::', appointment.rows.length);

  return appointment.rows;
};

const weeklyIndividual = async (param) => {
  moment.updateLocale('en', {
    week: {
      dow: 0, // Sunday
    },
  });
  // Define the week number you want to get the start and end dates for
  const weekNumber = param.week; // Change this to the desired week number
  // Get the start date of the week
  const startDateOfWeek = moment().isoWeek(weekNumber).startOf('week');
  // Get the end date of the week
  const endDateOfWeek = moment().isoWeek(weekNumber).endOf('week');
  // Format the start and end dates
  const formattedStartDateOfWeek = startDateOfWeek.format('YYYY-MM-DD');
  const formattedEndDateOfWeek = endDateOfWeek.format('YYYY-MM-DD');

  const appointment = await knex.raw(
    ` SELECT sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,
      '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
      json_agg(ssci.*) -> 0 AS store_service_category_item
      FROM store_appointment as sa
      left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
      WHERE sa.store_employee = :storeEmployee 
      AND sa.tenant = :tenant 
      AND sa.appointment_time::date >= DATE(:startDate) 
      AND sa.appointment_time::date <= DATE(:endDate)
      GROUP BY sa.id;
    `,
    {
      storeEmployee: param.storeEmployee,
      tenant: param.tenant,
      startDate: formattedStartDateOfWeek,
      endDate: formattedEndDateOfWeek,
    }
  );

  // const newArr = appointment.rows.map((item) => {
  //   const newdata = {
  //     ...item,
  //     appointment_time: moment(item.appointment_time).format(
  //       'YYYY-MM-DD HH:mm'
  //     ),
  //   };
  //   return appointment.rows;
  // });

  return appointment.rows;
};

const monthly = async (param) => {
  // console.log('param:::::::', param);

  const startOfMonth = moment(param.month)
    .startOf('month')
    .format('YYYY-MM-DD');
  const endOfMonth = moment(param.month).endOf('month').format('YYYY-MM-DD');

  // const appointment = await knex.raw(
  //   ` SELECT sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,
  //     '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
  //     json_agg(ssci.*) -> 0 AS store_service_category_item
  //     FROM store_appointment as sa
  //     left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
  //     WHERE sa.tenant = :tenant
  //     AND sa.appointment_time::date >= DATE(:startDate)
  //     AND sa.appointment_time::date <= DATE(:endDate)
  //     GROUP BY sa.id;
  //   `,
  //   {
  //     tenant: param.tenant,
  //     startDate: startOfMonth,
  //     endDate: endOfMonth,
  //   }
  // );

  const appointment = await knex.raw(
    `
    SELECT DISTINCT ON (sa.code) sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,sa.code,sa.appointment_type,sa.guest_type,
    '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
    json_agg(ssci.*) -> 0 AS store_service_category_item
    FROM ${MODULE.STORE.APPOINTMENT} as sa
    left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
    WHERE sa.tenant = :tenant
    AND sa.appointment_time::date >= DATE(:startDate) 
    AND sa.appointment_time::date <= DATE(:endDate)
    GROUP BY sa.id
    ORDER BY sa.code DESC, sa.id ASC
    `,
    {
      tenant: param.tenant,
      startDate: startOfMonth,
      endDate: endOfMonth,
    }
  );

  // console.log(prettyPrintJSON(appointment.rows));
  return appointment.rows;
};

const distinctMonthly = async (param) => {
  // console.log('param:::::::', param);

  const startOfMonth = moment(param.month)
    .startOf('month')
    .format('YYYY-MM-DD');
  const endOfMonth = moment(param.month).endOf('month').format('YYYY-MM-DD');

  const appointment = await knex.raw(
    `
    SELECT DISTINCT ON (sa.code) sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,sa.code,sa.appointment_type,sa.guest_type,
    '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
    json_agg(ssci.*) -> 0 AS store_service_category_item
    FROM ${MODULE.STORE.APPOINTMENT} as sa
    left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
    WHERE sa.tenant = :tenant
    AND sa.guest_type = :guestType
    AND sa.appointment_time::date >= DATE(:startDate) 
    AND sa.appointment_time::date <= DATE(:endDate)
    GROUP BY sa.id
    ORDER BY sa.code DESC, sa.id ASC
    `,
    {
      tenant: param.tenant,
      guestType: 'Self',
      startDate: startOfMonth,
      endDate: endOfMonth,
    }
  );

  // console.log(prettyPrintJSON(appointment.rows));
  return appointment.rows;
};

const monthlyIndividual = async (param) => {
  // console.log('param:::::::', param);

  const startOfMonth = moment(param.month)
    .startOf('month')
    .format('YYYY-MM-DD');
  const endOfMonth = moment(param.month).endOf('month').format('YYYY-MM-DD');

  const appointment = await knex.raw(
    ` SELECT sa.id, sa.name, sa.status, sa.store_employee, sa.appointment_time, sa.service_time,
      '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
      json_agg(ssci.*) -> 0 AS store_service_category_item
      FROM store_appointment as sa
      left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
      WHERE sa.store_employee = :storeEmployee 
      AND sa.tenant = :tenant 
      AND sa.appointment_time::date >= DATE(:startDate) 
      AND sa.appointment_time::date <= DATE(:endDate)
      GROUP BY sa.id;
    `,
    {
      storeEmployee: param.storeEmployee,
      tenant: param.tenant,
      startDate: startOfMonth,
      endDate: endOfMonth,
    }
  );

  // console.log(prettyPrintJSON(appointment.rows));
  return appointment.rows;
};

const employeeLov = async (param) => {
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
    .where('store_service_category_item', param.storeServiceCategoryItem)
    .andWhere({ 'service.is_deleted': false, 'service.is_active': true })
    .andWhere({ 'employee.is_deleted': false, 'employee.is_active': true })
    .andWhere({ 'schedule.is_active': true, 'schedule.is_deleted': false })
    .groupBy('service.id');

  const employeeList = findEmployees.map(async (item) => {
    delete item.service_time;
    const storeServiceCatItem = await knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
      .where('id', item.store_service_category_item)
      .first();
    let serviceTime = 0;
    if (storeServiceCatItem) {
      serviceTime = storeServiceCatItem.service_time;
    }
    item.service_time = serviceTime;
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

const linedUp = async (param) => {
  const appointment = await knex.raw(
    `SELECT * FROM store_appointment 
    WHERE store_employee=:storeEmployee AND status::text = :status AND appointment_time::date = date(:linedUpDate)`,
    {
      storeEmployee: param.storeEmployee,
      status: APPOINTMENT_STATUS.NEW,
      linedUpDate: moment(param.linedUpDate).format('YYYY-MM-DD'),
    }
  );
  return appointment.rows;
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
      result.hasError = true;
      result.message = `Employee is not available`;
      return result;
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
          createAppTime < prevTime ||
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

const checkRescheduleAppointment = async (param, data) => {
  const result = { hasError: false };
  const newAppointmentArr = [];
  // console.log('data::::::', data);
  const item = data;

  const newParam = {
    ...param,
    employeeId: item.store_employee,
    date: item.appointment_time,
  };

  // console.log('newParam::::::', newParam);

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
    // throw new Error('Employee schedule is not matched');
    result.hasError = true;
    result.message = `Employee is not available`;
    return result;
  }
  const storeEmployeeService = await knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
    .where('id', item.store_service_category_item)
    .first();

  // console.log('storeEmployeeService::::::', storeEmployeeService);

  const employeeStartTime = moment(employeeSchedule.start_time).format('HH:mm');
  const createAppTime = moment(item.appointment_time).format('HH:mm');
  const convertCreateAppTime = moment(item.appointment_time)
    .add(storeEmployeeService.service_time, 'minute')
    .format('HH:mm');

  // console.log('Time', createAppTime, convertCreateAppTime);
  if (createAppTime < employeeStartTime) {
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
    let prevTime = employeeStartTime;

    for (const key in appointment.rows) {
      const storeServiceCategoryItem = await knex(
        MODULE.STORE.SERVICE_CATEGORY_ITEM
      )
        .where('id', appointment.rows[key].store_service_category_item)
        .first();
      const appointmentItem = appointment.rows[key];
      const appointmentTime = moment(appointmentItem.appointment_time).format(
        'HH:mm'
      );
      const convertAppointmentTime = moment(appointmentItem.appointment_time)
        .add(storeServiceCategoryItem.service_time, 'minute')
        .format('HH:mm');

      // console.log('createAppTime', createAppTime);
      // console.log('convertCreateAppTime', convertCreateAppTime);
      // console.log('===============');
      // console.log('createAppTime', createAppTime);
      // console.log('prevTime', prevTime);
      // console.log('convertCreateAppTime', convertCreateAppTime);
      // console.log('appointmentTime', appointmentTime);

      // console.log('employeeStartTime:::::::', employeeStartTime);
      // console.log('prevTime:::::::', prevTime);
      // console.log('createAppTime:::::::', createAppTime);
      // console.log('convertAppointmentTime:::::::', convertAppointmentTime);
      // console.log('appointmentTime:::::::', appointmentTime);

      if (createAppTime > prevTime && createAppTime > convertAppointmentTime) {
        // console.log('1');
        prevTime = convertAppointmentTime;
      } else if (
        createAppTime < prevTime ||
        convertCreateAppTime >= appointmentTime
      ) {
        // console.log('2');
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
  // console.log('data:::::::', data);
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
    if (checkAppointmentService.hasError) {
      await transaction.rollback();
      const newError = new Error(checkAppointmentService.message);
      newError.detail = newError.message;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const tenantFind = await knex(MODULE.TENANT)
      .where('id', param.tenant)
      .first();
    const tenantConfigFind = await knex(MODULE.TENANT_CONFIG)
      .where('id', tenantFind.tenant_config)
      .first();
    const gstPercentage = tenantConfigFind.gst_percentage;
    const code = generateRandomString();
    const storeAppointmentQueryPromise = data.appointments.map(
      async (item, index) => {
        if (
          moment(item.appointment_time).format('YYYYMMDDHHmm') <
          moment().format('YYYYMMDDHHmm')
        ) {
          await transaction.rollback();
          const newError = new Error(`Appointment can not be schedule earlier`);
          newError.detail = newError.message;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
        const newNumber = await appointmentCount(
          item.appointment_time,
          param.tenant
        );

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
          appointment_type: item.appointment_type || 'Professional',
          status: data.status || APPOINTMENT_STATUS.NEW,
          appointment_number: Number(newNumber) + index + 1,
          tenant: param.tenant,
          created_by: param.userId,
          updated_by: param.userId,
          app_user: param.appUser || data.app_user,
          service_time: Number(storeServiceCategoryItem.service_time),
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

const pengCreate = async (param, data) => {
  // console.log('data:::::::', data);
  const transaction = await knex.transaction();
  try {
    if (!data.appointments.length) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `No appointmentdata is provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    // const checkAppointmentService = await checkAppointment(param, data);
    const checkAppointmentService = { hasError: false };
    // console.log('checkAppointmentService:::::::::', checkAppointmentService);
    if (checkAppointmentService.hasError) {
      await transaction.rollback();
      const newError = new Error(`No Appointment Create`);
      newError.detail = newError.message;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const tenantFind = await knex(MODULE.TENANT)
      .where('id', param.tenant)
      .first();
    const tenantConfigFind = await knex(MODULE.TENANT_CONFIG)
      .where('id', tenantFind.tenant_config)
      .first();
    const gstPercentage = tenantConfigFind.gst_percentage;
    const code = generateRandomString();
    const storeAppointmentQueryPromise = data.appointments.map(
      async (item, index) => {
        if (
          moment(item.appointment_time).format('YYYYMMDDHHmm') <
          moment().format('YYYYMMDDHHmm')
        ) {
          await transaction.rollback();
          const newError = new Error(`Appointment can not be schedule earlier`);
          newError.detail = newError.message;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
        const newNumber = await appointmentCount(
          item.appointment_time,
          param.tenant
        );

        const storeEmployeeService = item.store_service_category_item
          ? await knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
              .where({
                id: item.store_service_category_item,
              })
              .first()
          : { service_time: 15 };

        const serviceTime =
          storeEmployeeService.service_time &&
          storeEmployeeService.service_time > 0
            ? storeEmployeeService.service_time
            : 15;

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
          store_employee: item.store_employee || null,
          appointment_time: item.appointment_time,
          appointment_type: item.appointment_type ?? 'Professional',
          status: data.status || APPOINTMENT_STATUS.NEW,
          appointment_number: Number(newNumber) + index + 1,
          tenant: param.tenant,
          created_by: param.userId,
          updated_by: param.userId,
          app_user: param.appUser || null,
          guest_type: 'Self',
          service_time: Number(serviceTime),
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

    if (data.guest && data.guest.length > 0) {
      data.guest.map((guest) => {
        const guestStoreAppointmentQueryPromise = guest.appointments.map(
          async (item, index) => {
            if (
              moment(item.appointment_time).format('YYYYMMDDHHmm') <
              moment().format('YYYYMMDDHHmm')
            ) {
              await transaction.rollback();
              const newError = new Error(
                `Appointment can not be schedule earlier`
              );
              newError.detail = newError.message;
              newError.code = HTTP_STATUS.BAD_REQUEST;
              throw newError;
            }
            const newNumber = await appointmentCount(
              item.appointment_time,
              param.tenant
            );

            const storeEmployeeService = item.store_service_category_item
              ? await knex(MODULE.STORE.SERVICE_CATEGORY_ITEM)
                  .where({
                    id: item.store_service_category_item,
                  })
                  .first()
              : { service_time: 15 };

            const serviceTime =
              storeEmployeeService.service_time &&
              storeEmployeeService.service_time > 0
                ? storeEmployeeService.service_time
                : 15;

            const storeServiceCategoryItem = await knex(
              MODULE.STORE.SERVICE_CATEGORY_ITEM
            )
              .where('id', item.store_service_category_item)
              .first();

            const newData = {
              note: data.note,
              name: guest.name,
              gender: data.gender,
              phone: data.phone,
              email: data.email,
              store_service_category: item.store_service_category,
              store_service_category_item: item.store_service_category_item,
              store_employee: item.store_employee || null,
              appointment_time: item.appointment_time,
              appointment_type: item.appointment_type ?? 'Professional',
              status: data.status || APPOINTMENT_STATUS.NEW,
              appointment_number: Number(newNumber) + index + 1,
              tenant: param.tenant,
              created_by: param.userId,
              updated_by: param.userId,
              app_user: param.appUser || null,
              guest_type: 'Guest',
              service_time: Number(serviceTime),
              code,
            };

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

        guestStoreAppointmentQueryPromise.forEach((TrnsactQuery) => {
          storeAppointmentQueryPromise.push(TrnsactQuery);
        });
        return null;
      });
    }

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
  // console.log('param, data :>> ', param, data);
  const appointments = await knex(MODULE.STORE.APPOINTMENT).where(
    'code',
    param.code
  );
  if (!appointments.length) {
    const newError = new Error(`Commit`);
    newError.detail = `No appointment is available`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const ids = appointments.map((item) => {
    if (item.status === APPOINTMENT_STATUS.NEW) {
      return item.id;
    }
    return false;
  });

  if (ids.length) {
    const reScheduleAppointments = await knex(MODULE.STORE.APPOINTMENT)
      .update({ status: APPOINTMENT_STATUS.RESCHEDULE })
      .whereIn('id', ids)
      .returning('*');

    if (!reScheduleAppointments.length) {
      const newError = new Error(`Commit`);
      newError.detail = `Appointment status is not re-scheduled.`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
  }

  return create(param, data);
};

const individualReSchedule = async (param, data) => {
  // console.log('data:::::::', data);
  const transaction = await knex.transaction();
  try {
    let returnData = null;
    const findAppointment = await knex(MODULE.STORE.APPOINTMENT)
      .where('id', param.storeAppointment)
      .first();

    findAppointment.appointment_time = data.appointment_time;
    if (!findAppointment) {
      const newError = new Error(`Commit`);
      newError.detail = `No appointment is available`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const checkAppointmentService = await checkRescheduleAppointment(
      param,
      findAppointment
    );

    // console.log(
    //   'checkAppointmentService::::::::::::::',
    //   checkAppointmentService
    // );
    if (checkAppointmentService.hasError) {
      const newError = new Error(checkAppointmentService.message);
      newError.detail = newError.message;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    if (findAppointment.status === APPOINTMENT_STATUS.NEW) {
      const [appointment] = await transaction(MODULE.STORE.APPOINTMENT)
        .update({ status: APPOINTMENT_STATUS.RESCHEDULE })
        .where('id', findAppointment.id)
        .returning('*');

      returnData = appointment;

      if (!appointment) {
        await transaction.rollback();
        const newError = new Error(`Commit`);
        newError.detail = `Appointment status ${findAppointment.status} is not re-scheduled.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    const tenantFind = await knex(MODULE.TENANT)
      .where('id', param.tenant)
      .first();
    const tenantConfigFind = await knex(MODULE.TENANT_CONFIG)
      .where('id', tenantFind.tenant_config)
      .first();
    const gstPercentage = tenantConfigFind.gst_percentage;
    const code = generateRandomString();
    const item = findAppointment;
    item.appointment_time = data.appointment_time;
    if (
      moment(item.appointment_time).format('YYYYMMDDHHmm') <
      moment().format('YYYYMMDDHHmm')
    ) {
      await transaction.rollback();
      const newError = new Error(`Appointment can not be schedule earlier`);
      newError.detail = newError.message;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const newNumber = await appointmentCount(
      findAppointment.appointment_time,
      param.tenant
    );

    const storeServiceCategoryItem = await knex(
      MODULE.STORE.SERVICE_CATEGORY_ITEM
    )
      .where('id', findAppointment.store_service_category_item)
      .first();

    const newData = {
      note: findAppointment.note,
      name: findAppointment.name,
      gender: findAppointment.gender,
      phone: findAppointment.phone,
      email: findAppointment.email,
      store_service_category: findAppointment.store_service_category,
      store_service_category_item: findAppointment.store_service_category_item,
      store_employee: findAppointment.store_employee,
      appointment_time: findAppointment.appointment_time,
      appointment_type: findAppointment.appointment_type || 'Professional',
      status: findAppointment.status || APPOINTMENT_STATUS.NEW,
      appointment_number: Number(newNumber) + 1,
      tenant: param.tenant,
      created_by: param.userId,
      updated_by: param.userId,
      app_user: param.appUser || findAppointment.app_user,
      service_time: Number(storeServiceCategoryItem.service_time),
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

    const storeAppointment = await transaction(MODULE.STORE.APPOINTMENT)
      .insert(newData)
      .returning('*');

    if (!storeAppointment.length) {
      await transaction.rollback();
      const newError = new Error(`Appointment can not be create earlier`);
      newError.detail = newError.message;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return returnData;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const update = async (param, data) => {
  // console.log('param, data :>> ', param, data);
  const findAppointment = await knex(MODULE.STORE.APPOINTMENT).where(
    'id',
    param.storeAppointment
  );
  if (!findAppointment) {
    const newError = new Error(`Commit`);
    newError.detail = `No appointment is available`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  const newData = {
    note: data.note,
    name: data.name,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    updated_by: param.userId,
  };
  return knex(MODULE.STORE.APPOINTMENT)
    .update(newData)
    .where('id', param.storeAppointment)
    .returning('*');
};

const serviceDetail = async (param) =>
  knex
    .select([
      'service.*',
      knex.raw(`json_agg("catItem".*) -> 0 AS store_service_category_item`),
    ])
    .from(`${MODULE.STORE.EMPLOYEE_SERVICE} AS service`)
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} AS catItem`, // Ensure correct table alias
      'catItem.id',
      'service.store_service_category_item'
    )
    .where({
      'service.store_employee': param.storeEmployee,
      'service.store_service_category_item': param.storeServiceCategoryItem,
    })
    .groupBy('service.id')
    .first();

const getAppointment = async (param) => {
  const appointment = await knex(MODULE.STORE.APPOINTMENT)
    .where('id', param.storeAppointment)
    .first();

  const appointmentArr = await knex
    .select([
      'sa.*',
      knex.raw(
        `'#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number`
      ),
      knex.raw(`json_agg(se.*) -> 0 AS store_employee`),
      knex.raw(`json_agg(ssci.*) -> 0 AS store_service_category_item`),
      knex.raw(`json_agg(wt.*) -> 0 AS wallets`),
    ])
    .from(`${MODULE.STORE.APPOINTMENT} as sa`)
    .leftJoin(`${MODULE.STORE.EMPLOYEE} as se`, 'se.id', 'sa.store_employee')
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .leftJoin(
      `${MODULE.WALLET_TRANSCATIONS} as wt`,
      'wt.reference_id',
      'sa.code'
    )
    .where({ 'sa.code': appointment.code })
    .groupBy('sa.id');

  const newPromise = appointmentArr.map(async (item) => {
    const [rating] = await knex(MODULE.STORE.EMPLOYEE_RATING)
      .sum('star')
      .where('store_employee', item.store_employee.id);

    const [ratingCount] = await knex(MODULE.STORE.EMPLOYEE_RATING)
      .count('star')
      .where('store_employee', item.store_employee.id);

    const totalRating = rating.sum ?? 0;
    const totalCounts = Number(ratingCount.count);

    const totalStarRating = totalRating / totalCounts;
    item.rating = Number.isNaN(totalStarRating)
      ? 0
      : parseInt(totalStarRating, 10);

    return item;
  });

  const promiseQuery = await Promise.all(newPromise);

  return {
    ...appointment,
    services: promiseQuery,
  };
};

const getAppointmentByCode = async (param) => {
  const appointments = await knex
    .select([
      'sa.*',
      knex.raw(
        `'#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number`
      ),
      knex.raw(`json_agg(se.*) -> 0 AS store_employee`),
      knex.raw(`json_agg(ssci.*) -> 0 AS store_service_category_item`),
    ])
    .from(`${MODULE.STORE.APPOINTMENT} as sa`)
    .leftJoin(`${MODULE.STORE.EMPLOYEE} as se`, 'se.id', 'sa.store_employee')
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .where({ 'sa.code': param.code })
    .groupBy('sa.id')
    .orderBy('sa.created_date', 'ASC');

  const newPromise = appointments.map(async (item) => {
    const [rating] = await knex(MODULE.STORE.EMPLOYEE_RATING)
      .sum('star')
      .where('store_employee', item.store_employee.id);

    const [ratingCount] = await knex(MODULE.STORE.EMPLOYEE_RATING)
      .count('star')
      .where('store_employee', item.store_employee.id);

    const totalRating = rating.sum ?? 0;
    const totalCounts = Number(ratingCount.count);

    const totalStarRating = totalRating / totalCounts;
    item.rating = Number.isNaN(totalStarRating)
      ? 0
      : parseInt(totalStarRating, 10);

    return item;
  });

  const promiseQuery = await Promise.all(newPromise);
  const [appointment] = appointments;

  let wallet = null;
  const wallets = await knex(MODULE.WALLETS)
    .where('app_user', appointment.app_user)
    .first();
  if (wallets) {
    wallet = wallets;
  }

  appointment.wallet = wallet;

  return {
    ...appointment,
    services: promiseQuery,
  };
};

const allServicesCancell = async (param, data) =>
  knex(MODULE.STORE.APPOINTMENT)
    .update(data)
    .where('code', param.code)
    .returning('*');

const statusUpdate = async (id, data) =>
  knex(MODULE.STORE.APPOINTMENT).update(data).where('id', id).returning('*');

const processingAppointment = async (id, data) => {
  let appointment = await knex(MODULE.STORE.APPOINTMENT)
    .where('id', id)
    .first();

  if (
    appointment.status === APPOINTMENT_STATUS.DONE ||
    appointment.status === APPOINTMENT_STATUS.NEW
  ) {
    appointment = await knex(MODULE.STORE.APPOINTMENT)
      .update(data)
      .where('id', id)
      .returning('*');
  }

  return appointment;
};

const fetchAppointments = async (params) => {
  const appointmentNumber = knex.raw(
    `'#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number`
  );
  let baseQuery = knex
    .select([
      'sa.*',
      'ssci.name as service',
      'se.name as store_employee_name',
      appointmentNumber,
    ])
    .from(`${MODULE.STORE.APPOINTMENT} as sa`)
    .where('sa.tenant', params.tenant)
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .leftJoin(`${MODULE.STORE.EMPLOYEE} as se`, 'se.id', 'sa.store_employee');

  if (params.startDate && params.endDate) {
    if (params.startDate === params.endDate) {
      baseQuery = baseQuery.whereRaw(
        'DATE(sa.appointment_time)=?',
        params.startDate
      );
    } else {
      baseQuery = baseQuery.whereRaw(
        'DATE(sa.appointment_time)>=?',
        params.startDate
      );
      baseQuery = baseQuery.whereRaw(
        'DATE(sa.appointment_time)<=?',
        params.endDate
      );
    }
  } else if (params.startDate) {
    baseQuery = baseQuery.whereRaw(
      'DATE(sa.appointment_time)>=?',
      params.startDate
    );
  } else if (params.endDate) {
    baseQuery = baseQuery.whereRaw(
      'DATE(sa.appointment_time)<=?',
      params.endDate
    );
  }

  if (params.search) {
    baseQuery = baseQuery.where((builder) => {
      builder
        .where('sa.name', 'like', `%${params.search}%`)
        .orWhere('sa.email', 'like', `%${params.search}%`)
        .orWhere('ssci.name', 'like', `%${params.search}%`);
    });
  }

  if (params.app_user) {
    baseQuery = baseQuery.where('sa.app_user', params.app_user);
  }

  if (params.status) {
    if (params.status === 'Incomplete') {
      baseQuery = baseQuery.whereNot('sa.status', APPOINTMENT_STATUS.COMPLETED);
    } else {
      baseQuery = baseQuery.where('sa.status', params.status);
    }
  }

  const countQuery = baseQuery.clone().clearSelect().count('* as totalCount');

  baseQuery = baseQuery
    .orderBy('sa.created_date', 'desc')
    .limit(params.size)
    .offset(params.page * params.size);

  // Execute both queries in parallel
  return Promise.all([baseQuery, countQuery]).then(
    ([appointments, [{ totalCount }]]) => ({ appointments, totalCount })
  );
};

const findProcessingAppointment = (param) =>
  knex(MODULE.STORE.APPOINTMENT)
    .where({
      id: param.storeAppointment,
      status: APPOINTMENT_STATUS.PROCESSING,
    })
    .first();

const findCheckProcessingAppointment = (param) =>
  knex(MODULE.STORE.APPOINTMENT)
    .where({
      id: param.storeAppointment,
      status: APPOINTMENT_STATUS.DONE,
    })
    .first();

const findById = (id) => knex(MODULE.STORE.APPOINTMENT).where('id', id).first();

// const paidStatusUpdate = async (params, data) => {
//   const transaction = await knex.transaction();
//   try {
//     const findAppointment = await transaction(MODULE.STORE.APPOINTMENT)
//       .where('id', params.storeAppointment)
//       .first();
//     if (!findAppointment) {
//       await transaction.rollback();
//       const newError = new Error(`No appointment foun`);
//       newError.detail = `No appointment found`;
//       newError.code = HTTP_STATUS.BAD_REQUEST;
//       throw newError;
//     }
//     const [updateAppointment] = await transaction(MODULE.STORE.APPOINTMENT)
//       .update(data)
//       .where('id', findAppointment.id)
//       .returning('*');
//     if (!updateAppointment) {
//       await transaction.rollback();
//       const newError = new Error(`Appointment isn't update`);
//       newError.detail = `Appointment isn't update`;
//       newError.code = HTTP_STATUS.BAD_REQUEST;
//       throw newError;
//     }

//     if (findAppointment.app_user) {
//       const ratingData = {
//         store_employee: findAppointment.store_employee,
//         store_appointment: findAppointment.id,
//         status: RATING_STATUS.PENDING,
//         tenant: findAppointment.tenant,
//         app_user: findAppointment.app_user,
//       };
//       const [createStoreRating] = await transaction(
//         MODULE.STORE.EMPLOYEE_RATING
//       )
//         .insert(ratingData)
//         .returning('*');
//       if (!createStoreRating) {
//         await transaction.rollback();
//         const newError = new Error(`Store rating not created`);
//         newError.detail = `Store rating not created`;
//         newError.code = HTTP_STATUS.BAD_REQUEST;
//         throw newError;
//       }
//       updateAppointment.storeEmployeeRating = createStoreRating;
//     }

//     const commit = await transaction.commit();
//     if (commit.response.rowCount !== null) {
//       await transaction.rollback();
//       const newError = new Error(`Commit`);
//       newError.detail = `Commit service is not execute`;
//       newError.code = HTTP_STATUS.BAD_REQUEST;
//       throw newError;
//     }
//     return updateAppointment;
//   } catch (error) {
//     await transaction.rollback();
//     throw error;
//   }
// };

const servicePaid = async (params, data) => {
  const transaction = await knex.transaction();
  try {
    const processingServices = await transaction(MODULE.STORE.APPOINTMENT)
      .where('code', params.code)
      .andWhere((db) => {
        db.orWhere('status', APPOINTMENT_STATUS.PROCESSING).orWhere(
          'status',
          APPOINTMENT_STATUS.NEW
        );
      });

    if (processingServices.length) {
      const newError = new Error(
        `Some services you haven't done before, please get them done.`
      );
      newError.detail = `Some services you haven't done before, please get them done.`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const appointments = await transaction(MODULE.STORE.APPOINTMENT).where({
      code: params.code,
      status: APPOINTMENT_STATUS.DONE,
    });

    if (!appointments.length) {
      // await transaction.rollback();
      const newError = new Error(`No appointment found`);
      newError.detail = `No appointment found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const promiseQuery = appointments.map(async (item) => {
      const [updateAppointment] = await transaction(MODULE.STORE.APPOINTMENT)
        .update(data)
        .where('id', item.id)
        .returning('*');
      if (!updateAppointment) {
        await transaction.rollback();
        const newError = new Error(`Appointment isn't update`);
        newError.detail = `Appointment isn't update`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      if (item.app_user) {
        const ratingData = {
          store_employee: item.store_employee,
          store_appointment: item.id,
          status: RATING_STATUS.PENDING,
          tenant: item.tenant,
          app_user: item.app_user,
        };
        const [createStoreRating] = await transaction(
          MODULE.STORE.EMPLOYEE_RATING
        )
          .insert(ratingData)
          .returning('*');
        if (!createStoreRating) {
          await transaction.rollback();
          const newError = new Error(`Store rating not created`);
          newError.detail = `Store rating not created`;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
        updateAppointment.storeEmployeeRating = createStoreRating;
      }
      return updateAppointment;
    });

    const promise = await Promise.all(promiseQuery);

    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return promise;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const serviceDone = async (param, data) => {
  const appointment = await knex(MODULE.STORE.APPOINTMENT)
    .where({
      id: param.storeAppointment,
      status: APPOINTMENT_STATUS.PROCESSING,
    })
    .first();

  if (!appointment) {
    // await transaction.rollback();
    const newError = new Error(`No processing appointment found`);
    newError.detail = `No processing appointment found`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const [returnData] = await knex(MODULE.STORE.APPOINTMENT)
    .update(data)
    .where('id', param.storeAppointment)
    .returning('*');

  return returnData;
};

const appointmentInvoice = async (param) => {
  const appointmentsArr = await knex(MODULE.STORE.APPOINTMENT)
    .where('code', param.code)
    .andWhere((db) => {
      db.orWhere('status', APPOINTMENT_STATUS.NEW)
        .orWhere('status', APPOINTMENT_STATUS.DONE)
        .orWhere('status', APPOINTMENT_STATUS.PROCESSING)
        .orWhere('status', APPOINTMENT_STATUS.COMPLETED);
    });

  if (appointmentsArr.length) {
    const ids = appointmentsArr.map((item) => item.id);
    const appointments = await knex
      .select([
        'sa.*',
        knex.raw(
          `'#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number`
        ),
        knex.raw(
          `json_agg(json_build_object('id', ssci.id, 'name', ssci.name, 'avatar', ssci.avatar)) -> 0 store_service_category_item`
        ),
      ])
      .from(`${MODULE.STORE.APPOINTMENT} as sa`)
      .leftJoin(
        `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
        'ssci.id',
        'sa.store_service_category_item'
      )
      .whereIn('sa.id', ids)
      .groupBy('sa.id');

    let totalAmount = 0;
    let totalGstAmount = 0;
    let grandTotalAmount = 0;
    const newArr = [];

    if (appointments.length) {
      appointments.forEach((item) => {
        totalAmount += Number(item.total_amount);
        totalGstAmount += Number(item.gst_amount);
        grandTotalAmount += Number(item.grand_total_amount);
        const newData = {
          status: item.status,
          amount: item.total_amount,
          created_date: item.created_date,
          updated_date: item.updated_date,
          appointment_time: item.appointment_time,
          service_time: item.service_time,
          appointment_number: item.appointment_number,
          store_service_category_item: item.store_service_category_item,
        };
        newArr.push(newData);
      });
    }

    const [findAppointment] = appointmentsArr;

    const returnData = {
      id: findAppointment.id,
      name: findAppointment.name,
      phone: findAppointment.phone,
      email: findAppointment.email,
      gender: findAppointment.gender,
      note: findAppointment.note,
      code: findAppointment.code,
      gst_percentage: findAppointment.gst_percentage,
      gst_amount: totalGstAmount,
      total_amount: totalAmount,
      grand_total_amount: grandTotalAmount,
      appointments: newArr,
    };

    return returnData;
  }

  const newError = new Error(`No processing appointment found`);
  newError.detail = `No processing appointment found`;
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

const appointmentInvoiceByStatusDone = async (param) => {
  const findAppointment = await knex(MODULE.STORE.APPOINTMENT)
    .where('id', param.storeAppointment)
    .first();

  const appointments = await knex
    .select([
      'sa.*',
      knex.raw(
        `'#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number`
      ),
      knex.raw(
        `json_agg(json_build_object('id', ssci.id, 'name', ssci.name, 'avatar', ssci.avatar)) -> 0 store_service_category_item`
      ),
    ])
    .from(`${MODULE.STORE.APPOINTMENT} as sa`)
    .leftJoin(
      `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as ssci`,
      'ssci.id',
      'sa.store_service_category_item'
    )
    .where({
      'sa.code': findAppointment.code,
      'sa.status': APPOINTMENT_STATUS.DONE,
    })
    .groupBy('sa.id');

  let totalAmount = 0;
  let totalGstAmount = 0;
  let grandTotalAmount = 0;
  const newArr = [];

  if (appointments.length) {
    appointments.forEach((item) => {
      totalAmount += Number(item.total_amount);
      totalGstAmount += Number(item.gst_amount);
      grandTotalAmount += Number(item.grand_total_amount);
      const newData = {
        status: item.status,
        amount: item.total_amount,
        created_date: item.created_date,
        updated_date: item.updated_date,
        appointment_time: item.appointment_time,
        service_time: item.service_time,
        appointment_number: item.appointment_number,
        store_service_category_item: item.store_service_category_item,
      };
      newArr.push(newData);
    });
  }

  const returnData = {
    id: findAppointment.id,
    name: findAppointment.name,
    phone: findAppointment.phone,
    email: findAppointment.email,
    gender: findAppointment.gender,
    note: findAppointment.note,
    code: findAppointment.code,
    gst_percentage: findAppointment.gst_percentage,
    gst_amount: totalGstAmount,
    total_amount: totalAmount,
    grand_total_amount: grandTotalAmount,
    appointments: newArr,
  };

  return returnData;
};

module.exports = {
  weekly,
  weeklyIndividual,
  monthly,
  monthlyIndividual,
  employeeLov,
  linedUp,
  create,
  serviceDetail,
  getAppointment,
  statusUpdate,
  servicePaid,
  update,
  reSchedule,
  fetchAppointments,
  findProcessingAppointment,
  processingAppointment,
  findById,
  checkAppointment,
  appointmentCount,
  pengCreate,
  distinctWeekly,
  distinctMonthly,
  getAppointmentByCode,
  findCheckProcessingAppointment,
  appointmentInvoice,
  individualReSchedule,
  appointmentInvoiceByStatusDone,
  allServicesCancell,
  serviceDone,
};
