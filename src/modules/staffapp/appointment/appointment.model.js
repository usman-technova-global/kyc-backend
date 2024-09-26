/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
const moment = require('moment');
const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const {
  APPOINTMENT_STATUS,
  PAYROLL_TYPE,
  AMOUNT_TYPE,
} = require('../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
// const {
//   prettyPrintJSON,
// } = require('../../../../utils/commonUtils/prettyPrintJSON');
// const {
//   APPOINTMENT_STATUS,
// } = require('../../../utils/constants/enumConstants');
// const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (param) => {
  const appointment = await knex.raw(
    ` SELECT sa.*,
      '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
      json_agg(ssci.*) -> 0 AS store_service_category_item,
      json_agg(json_build_object('id', au.id, 'avatar', au.avatar)) -> 0 AS app_user
      FROM store_appointment as sa
      left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item 
      left join app_user as au on au.id = sa.app_user
      WHERE sa.store_employee = :storeEmployee 
      AND sa.appointment_time::date = DATE(:appointmentDate) 
      GROUP BY sa.id;
    `,
    {
      storeEmployee: param.userId,
      appointmentDate: moment(param.date).format('YYYY-MM-DD'),
    }
  );

  return appointment.rows;
};

const today = async (param) => {
  const appointment = await knex.raw(
    ` SELECT sa.*,
      '#APP'::text || to_char(sa.created_date, 'YYMM') || lpad(sa.appointment_number::text, 6, '0'::text) AS appointment_number,
      json_agg(ssci.*) -> 0 AS store_service_category_item,
      json_agg(json_build_object('id', au.id, 'avatar', au.avatar)) -> 0 AS app_user
      FROM store_appointment as sa
      left join store_service_category_item as ssci on ssci.id = sa.store_service_category_item
      left join app_user as au on au.id = sa.app_user
      WHERE sa.store_employee = :storeEmployee 
      AND sa.status = :status
      AND sa.appointment_time::date = DATE(:appointmentDate) 
      GROUP BY sa.id;
    `,
    {
      storeEmployee: param.userId,
      status: APPOINTMENT_STATUS.PROCESSING,
      appointmentDate: moment().format('YYYY-MM-DD'),
    }
  );

  return appointment.rows;
};

const done = async (param) => {
  const transaction = await knex.transaction();
  try {
    const findAppointment = await transaction(MODULE.STORE.APPOINTMENT)
      .where({
        id: param.storeAppointment,
        status: APPOINTMENT_STATUS.PROCESSING,
      })
      .first();

    if (!findAppointment) {
      const newError = new Error(`No appointment found`);
      newError.detail = `No appointment found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    if (findAppointment.status !== APPOINTMENT_STATUS.PROCESSING) {
      const newError = new Error(`Appointment is missed`);
      newError.detail = `Appointment is missed`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // console.log('findAppointment::::::::', findAppointment);

    const [appointmentUpdate] = await transaction(MODULE.STORE.APPOINTMENT)
      .update({ status: APPOINTMENT_STATUS.DONE })
      .where('id', findAppointment.id)
      .returning('*');

    if (!appointmentUpdate) {
      await transaction.rollback();
      const newError = new Error(`No appointment update`);
      newError.detail = `No appointment update`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // console.log('appointmentUpdate:::::::', appointmentUpdate);

    const findEmployee = await transaction(MODULE.STORE.EMPLOYEE)
      .where({
        id: param.userId,
      })
      .first();

    if (findEmployee.payroll_type !== PAYROLL_TYPE.SALARY) {
      const findEmployeeService = await transaction(
        MODULE.STORE.EMPLOYEE_SERVICE
      )
        .where({
          store_employee: param.userId,
          store_service_category_item:
            findAppointment.store_service_category_item,
        })
        .first();

      const findServiceCategoryItem = await transaction(
        MODULE.STORE.SERVICE_CATEGORY_ITEM
      )
        .where({
          id: findAppointment.store_service_category_item,
        })
        .first();

      let commission = findEmployeeService.amount;
      if (findEmployeeService.amount_type === AMOUNT_TYPE.PERCENTAGE) {
        commission = findServiceCategoryItem.price * (commission / 100);
      }
      const newData = {
        store_employee: param.userId,
        store_appointment: findAppointment.id,
        commission_type: findEmployeeService.amount_type,
        commission_amount: findEmployeeService.amount,
        service_price: findServiceCategoryItem.price,
        total_amount: commission,
        status: 'Approved',
      };
      const [employeePayroll] = await transaction(MODULE.STORE.EMPLOYEE_PAYROLL)
        .insert(newData)
        .returning('*');

      if (!employeePayroll) {
        await transaction.rollback();
        const newError = new Error(`No employee payroll create`);
        newError.detail = `No employee payroll create`;
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
    return appointmentUpdate;
  } catch (error) {
    return error;
  }
};

module.exports = {
  list,
  today,
  done,
};
