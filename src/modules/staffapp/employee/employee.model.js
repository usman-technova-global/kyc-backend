/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
// const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment/moment');
const knex = require('../../../config/databaseConnection');
const {
  calculateDistance,
  getTenantConfig,
} = require('../../../utils/commonUtil');
const MODULE = require('../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const {
  ATTENDANCE_TYPE,
  LEAVE_STATUS,
  APPOINTMENT_STATUS,
  RATING_STATUS,
} = require('../../../utils/constants/enumConstants');
// const {
//   prettyPrintJSON,
// } = require('../../../../utils/commonUtils/prettyPrintJSON');
// const {
//   APPOINTMENT_STATUS,
// } = require('../../../utils/constants/enumConstants');
// const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const loginService = async (identifier) =>
  knex
    .select('*')
    .from(MODULE.STORE.EMPLOYEE)
    .where({ email: identifier, is_active: true, is_deleted: false })
    .orWhere('phone', identifier);

const attendanceCheck = async (param) => {
  const currentDate = moment().format('YYYY-MM-DD');
  const employeeAttendance = await knex(MODULE.STORE.EMPLOYEE_ATTENDANCE).where(
    { store_employee: param.userId, attendance_date: currentDate }
  );
  const attendance = {
    timeIn: null,
    timeOut: null,
  };
  if (employeeAttendance.length > 0) {
    employeeAttendance.forEach((item) => {
      if (item.attendance_type === ATTENDANCE_TYPE.TIME_IN) {
        attendance.timeIn = item.attendance_time;
      } else {
        attendance.timeOut = item.attendance_time;
      }
    });
  }
  return attendance;
};

const registerDevice = async (param, data) => {
  const employeeDevice = await knex(MODULE.STORE.EMPLOYEE_DEVICE)
    .where('store_employee', param.userId)
    .first();

  let updatedData;
  if (employeeDevice) {
    updatedData = await knex(MODULE.STORE.EMPLOYEE_DEVICE)
      .update({
        token: data.token,
        device_type: data.device_type,
        device_id: data.device_id,
        updated_date: new Date(),
      })
      .where('store_employee', param.userId)
      .returning('*');
  } else {
    updatedData = await knex(MODULE.STORE.EMPLOYEE_DEVICE)
      .insert({
        ...data,
        store_employee: param.userId,
        tenant: param.tenant,
        is_notification_allowed: true,
      })
      .returning('*');
  }

  const [finalResult] = updatedData;

  return finalResult;
};

const attendanceScan = async (param, data) => {
  const currentTime = moment().format('YYYY-MM-DD HH:mm');
  const currentDate = moment().format('YYYY-MM-DD');
  const tenantConfig = await getTenantConfig(param.tenant);
  if (
    Number(tenantConfig.latitude) === 0 ||
    Number(tenantConfig.longitude) === 0
  ) {
    const newError = new Error(`No Latitude or Longitude found`);
    newError.detail = `No Latitude or Longitude found`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const officeLocation = {
    lat: Number(tenantConfig.latitude ?? 0), // Office latitude
    lng: Number(tenantConfig.longitude ?? 0), // Office longitude
  };

  // const officeLocation = {
  //   lat: Number(tenantConfig.latitude), // Office latitude
  //   lng: Number(tenantConfig.longitude), // Office longitude
  // };

  const distance = calculateDistance(
    data.latitude,
    data.longitude,
    officeLocation.lat,
    officeLocation.lng
  );
  // console.log(
  //   data.latitude,
  //   data.longitude,
  //   officeLocation.lat,
  //   officeLocation.lng
  // );

  // console.log('distance:::::::', distance);

  // Check if user is within below the meters of the office
  const isDistance =
    distance <= tenantConfig.attendance_distance > 0
      ? tenantConfig.attendance_distance
      : 500;
  // console.log('isDistance::::::', isDistance);
  if (!isDistance) {
    const newError = new Error(`No distance is allowed`);
    newError.detail = `No distance is allowed`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  const findAttendance = await attendanceCheck(param);
  let attendance = {
    timeIn: null,
    timeOut: null,
  };
  if (findAttendance.timeIn && findAttendance.timeOut) {
    attendance = findAttendance;
  }
  if (findAttendance.timeIn) {
    attendance.timeIn = currentTime;
  } else {
    await knex(MODULE.STORE.EMPLOYEE_ATTENDANCE).insert({
      store_employee: param.userId,
      attendance_time: currentTime,
      attendance_date: currentDate,
      attendance_type: ATTENDANCE_TYPE.TIME_IN,
    });
    attendance.timeIn = currentTime;
    return attendance;
  }
  if (findAttendance.timeOut) {
    attendance.timeOut = currentTime;
  } else {
    await knex(MODULE.STORE.EMPLOYEE_ATTENDANCE).insert({
      store_employee: param.userId,
      attendance_time: currentTime,
      attendance_date: currentDate,
      attendance_type: ATTENDANCE_TYPE.TIME_OUT,
    });
    attendance.timeOut = currentTime;
    const employeeLeaveQuery = await knex.raw(
      `SELECT * FROM ${MODULE.STORE.EMPLOYEE_LEAVE} 
          WHERE store_employee = :storeEmployee
          AND status = :status
          AND half_day = true
          AND (from_date::date >= DATE(:setDate) AND to_date::date <= DATE(:setDate))`,
      {
        storeEmployee: param.userId,
        status: LEAVE_STATUS.APPROVED,
        setDate: moment(currentTime).format('YYYY-MM-DD'),
      }
    );

    // console.log('employeeLeaveQuery::::::', employeeLeaveQuery.toString());

    const [employeeLeave] = employeeLeaveQuery.rows;

    if (employeeLeave) {
      const findAppointment = knex.raw(
        `SELECT * FROM ${MODULE.STORE.APPOINTMENT} WHERE store_employee = :storeEmployee AND appointment_time::date = DATE(:currentDate)`,
        {
          storeEmployee: param.userId,
          currentDate,
        }
      );
      const newArr = [];
      if (findAppointment.length) {
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

    return attendance;
  }
  return attendance;
};

const attendanceWeekly = async (param) => {
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

  const attendance = await knex.raw(
    ` SELECT * FROM store_employee_attendance
      WHERE store_employee = :storeEmployee 
      AND attendance_date >= :startDate
      AND attendance_date <= :endDate
    `,
    {
      storeEmployee: param.userId,
      startDate: formattedStartDateOfWeek,
      endDate: formattedEndDateOfWeek,
    }
  );

  const WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const newArr = [];
  let grandTotalMinutes = 0;
  WEEK.forEach((item) => {
    const attendanceFilter = attendance.rows.filter(
      (filterItem) => moment(filterItem.attendance_date).format('dddd') === item
    );
    if (attendanceFilter.length > 1) {
      const start = moment(attendanceFilter[0].attendance_time);
      const end = moment(attendanceFilter[1].attendance_time);
      // Calculate the difference
      const duration = moment.duration(end.diff(start));
      const hours = duration.hours();
      const minutes = duration.minutes();
      // Display the total time in minutes
      const totalMinutes = hours * 60 + minutes;
      newArr.push({ day: item, minutes: totalMinutes });
      grandTotalMinutes += totalMinutes;
    } else {
      newArr.push({ day: item, minutes: 0 });
    }
  });

  // const grandTotal = grandTotalMinutes;

  // const newData = {
  //   weekChart: newArr,
  //   totalMinutes: grandTotal,
  // };

  return {
    weekChart: newArr,
    totalMinutes: grandTotalMinutes,
  };
};

const leaveManagement = async (param) =>
  knex(MODULE.STORE.EMPLOYEE_LEAVE).where('store_employee', param.userId);

const doesSlotOverlap = (bookedStart, bookedEnd, newStart, newEnd) => {
  const tempBookedStart = moment(bookedStart).startOf('day');
  const tempBookedEnd = moment(bookedEnd).startOf('day');
  const tempNewStart = moment(newStart).startOf('day');
  const tempNewEnd = moment(newEnd).startOf('day');
  // console.log('tempBookedStart', tempBookedStart);
  // console.log('tempBookedEnd', tempBookedEnd);
  // console.log('tempNewStart', tempNewStart);
  // console.log('tempNewEnd', tempNewEnd);
  if (
    tempBookedEnd.isSameOrAfter(tempNewStart) &&
    tempBookedStart.isSameOrBefore(tempNewEnd)
  ) {
    return true;
  }
  return false;
};

const leaveManagementCreate = async (param, data, attachmentArr) => {
  // console.log('param', param, attachmentArr);
  const transaction = await knex.transaction();
  try {
    const leave = await knex(MODULE.STORE.EMPLOYEE_LEAVE).where({
      store_employee: param.userId,
      status: LEAVE_STATUS.PENDING,
    });

    for (let index = 0; index < leave.length; index += 1) {
      const item = leave[index];
      if (
        doesSlotOverlap(
          data.from_date,
          data.to_date,
          item.from_date,
          item.to_date
        )
      ) {
        // await transaction.rollback();
        const newError = new Error(`Leave already exist`);
        newError.detail = `Leave already exist`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    const findEmployee = await transaction(MODULE.STORE.EMPLOYEE)
      .where('id', param.userId)
      .first();

    const employeeLeaveData = {
      store_employee: findEmployee.id,
      leave_type: data.leave_type,
      from_date: data.from_date,
      to_date: data.to_date,
      half_day: data.half_day,
      note: data.note,
      status: LEAVE_STATUS.PENDING,
      tenant: param.tenant,
    };

    const [employeeLeave] = await transaction(MODULE.STORE.EMPLOYEE_LEAVE)
      .insert(employeeLeaveData)
      .returning('*');
    if (!employeeLeave) {
      await transaction.rollback();
      const newError = new Error(`No create service execute employee leave`);
      newError.detail = `No create service execute employee leave`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    if (attachmentArr.length > 0) {
      const attachment = attachmentArr.map((attachmentItem) => {
        // id	store_employee_leave	attachment	created_date
        const attachmentData = {
          id: uuidv4(),
          store_employee_leave: employeeLeave.id,
          attachment: attachmentItem.file,
          attachment_extension: attachmentItem.attachment_extension,
          created_date: new Date(),
        };
        return attachmentData;
      });

      // console.log('attachment:::::', attachment);

      const employeeLeaveAttachment = await transaction(
        MODULE.STORE.EMPLOYEE_LEAVE_ATTACHMENT
      )
        .insert(attachment)
        .returning('*');

      if (employeeLeaveAttachment.length <= 0) {
        await transaction.rollback();
        const newError = new Error(
          `No create service execute employee leave attachment`
        );
        newError.detail = `No create service execute employee leave attachment`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
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
    return employeeLeave;
  } catch (error) {
    await transaction.rollback();
    const newError = new Error(error);
    newError.detail = error.detail;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
};

const payroll = async (param) => {
  const findPayroll = await knex.raw(
    `SELECT pr.*,
    json_agg(sa.*) -> 0 AS store_appointment,
    json_agg(sci.*) -> 0 AS store_service_category_item,
    json_agg(au.*) -> 0 AS app_user
    FROM store_employee_payroll AS pr 
    LEFT JOIN store_appointment AS sa ON sa.id = pr.store_appointment 
    LEFT JOIN store_service_category_item AS sci ON sci.id = sa.store_service_category_item
    LEFT JOIN app_user AS au ON au.id = sa.app_user
    WHERE pr.store_employee = :storeEmployee 
    AND DATE(pr.created_date) = DATE(:payrollDate) 
    GROUP BY pr.id, sa.id;
`,
    {
      storeEmployee: param.userId,
      payrollDate: moment(param.date).format('YYYY-MM-DD'),
    }
  );
  return findPayroll.rows;
};

const attendanceYearly = async (param) => {
  const startOfYear = moment().startOf('year');
  const endOfYear = moment().endOf('year');

  const uniqueAttendance = await knex.raw(
    `SELECT DISTINCT ON (attendance_date) * FROM store_employee_attendance
    WHERE store_employee = :storeEmployee 
    AND attendance_date >= :startDate
    AND attendance_date <= :endDate
    `,
    {
      storeEmployee: param.userId,
      startDate: moment(startOfYear).format('YYYY-MM-DD'),
      endDate: moment(endOfYear).format('YYYY-MM-DD'),
    }
  );

  let grandTotalMinutes = 0;
  const promiseQuery = uniqueAttendance.rows.map(async (item) => {
    const attendance = await knex(MODULE.STORE.EMPLOYEE_ATTENDANCE).where({
      store_employee: param.userId,
      attendance_date: item.attendance_date,
    });
    if (attendance.length > 1) {
      const start = moment(attendance[0].attendance_time);
      const end = moment(attendance[1].attendance_time);
      // Calculate the difference
      const duration = moment.duration(end.diff(start));
      const hours = duration.hours();
      const minutes = duration.minutes();
      // Display the total time in minutes
      const totalMinutes = hours * 60 + minutes;
      grandTotalMinutes += totalMinutes;
      // console.log('grandTotalMinutes::::::', grandTotalMinutes);
      return totalMinutes;
    }
    return null;
  });

  await Promise.all(promiseQuery);

  return grandTotalMinutes;
};

const profile = async (param) => {
  const startOfYear = moment().startOf('year');
  const endOfYear = moment().endOf('year');
  // const storeEmployee = await knex
  //   .select([
  //     'se.*',
  //     knex.raw(`
  //       CASE WHEN count(ses.*) = 0 THEN
  //         '[]'::json
  //       ELSE
  //         json_agg(ses.*)
  //       END AS store_employee_service
  //   `),
  //   ])
  //   .from(`${MODULE.STORE.EMPLOYEE} as se`)
  //   .leftJoin(
  //     `${MODULE.STORE.EMPLOYEE_SERVICE} as ses`,
  //     'ses.store_employee',
  //     'se.id'
  //   )
  //   .where('se.id', param.userId)
  //   .groupBy('se.id')
  //   .first();

  const storeEmployeeService = await knex.raw(
    `
      SELECT
      store_employee.*,
      json_agg(
        json_build_object(
          'id', store_employee_service.id,
          'store_employee_service_id', store_employee_service.id ,
          'category_item', store_service_category_item.name
        )
      ) AS services
    FROM store_employee
    LEFT JOIN store_employee_service ON store_employee_service.store_employee  = store_employee.id
    LEFT JOIN store_service_category_item ON store_service_category_item.id  = store_employee_service.store_service_category_item
    WHERE store_employee.id = :storeEmployee
    GROUP BY store_employee.id;
  `,
    { storeEmployee: param.userId }
  );

  const [storeEmployee] = storeEmployeeService.rows;

  const totalMinutes = await attendanceYearly(param);

  const clientQuery = await knex.raw(
    `SELECT COUNT(id) as count FROM store_appointment
    WHERE store_employee = :storeEmployee 
    AND status::text = :status
    AND appointment_time::date >= date(:startDate)
    AND appointment_time::date <= date(:endDate)
    `,
    {
      storeEmployee: param.userId,
      status: APPOINTMENT_STATUS.COMPLETED,
      startDate: moment(startOfYear).format('YYYY-MM-DD'),
      endDate: moment(endOfYear).format('YYYY-MM-DD'),
    }
  );
  const [client] = clientQuery.rows;

  const ratingQuery = await knex.raw(
    `SELECT COUNT(id) as count, SUM(star) as star FROM store_employee_rating
    WHERE store_employee = :storeEmployee 
    AND status::text = :status
    AND created_date::date >= date(:startDate)
    AND created_date::date <= date(:endDate)
    `,
    {
      storeEmployee: param.userId,
      status: RATING_STATUS.COMPLETED,
      startDate: moment(startOfYear).format('YYYY-MM-DD'),
      endDate: moment(endOfYear).format('YYYY-MM-DD'),
    }
  );
  const [rating] = ratingQuery.rows;

  storeEmployee.clients = parseInt(client.count, 10);
  storeEmployee.totalMinutes = parseInt(totalMinutes, 10);
  storeEmployee.ratings =
    rating.length > 0 ? Number(rating.star) / Number(rating.count) : 0;

  return storeEmployee;
};

const schedule = async (param) =>
  knex(MODULE.STORE.EMPLOYEE_SCHEDULE)
    .where({ store_employee: param.userId, work_day: moment().format('dddd') })
    .first();

const update = (param, data) =>
  knex(MODULE.STORE.EMPLOYEE)
    .update(data)
    .where('id', param.userId)
    .returning('*');

const findByEmployee = async (userData) => {
  const employee = await knex
    .select('*')
    .from(MODULE.STORE.EMPLOYEE)
    .where({
      email: userData.email,
    })
    .first();

  if (!employee) {
    const noUser = new Error(
      `No User Of Employee Email ${userData.email} Exists`
    );
    noUser.detail = `Employee Does Not Exist`;
    noUser.code = HTTP_STATUS.NOT_FOUND;
    throw noUser;
  }

  return employee;
};

const resetPassword = async (userData) =>
  knex(MODULE.STORE.EMPLOYEE).update({ password: userData.password }).where({
    email: userData.email,
    tenant: userData.tenant,
  });

module.exports = {
  loginService,
  attendanceScan,
  attendanceCheck,
  attendanceWeekly,
  leaveManagement,
  leaveManagementCreate,
  payroll,
  profile,
  schedule,
  update,
  registerDevice,
  findByEmployee,
  resetEmployeePassword: resetPassword,
};
