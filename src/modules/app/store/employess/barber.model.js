/* eslint-disable no-param-reassign */
const moment = require('moment');
const knex = require('../../../../config/databaseConnection');
const {
  APPOINTMENT_STATUS,
} = require('../../../../utils/constants/enumConstants');
const MODULE = require('../../../../utils/constants/moduleNames');
const { toCamelCase } = require('../../../../utils/commonUtils/caseConversion');

const getBarbers = async (param) => {
  const { storeServiceCategoryItems } = param;

  const findEmployees = await knex
    .select([
      knex.raw(`json_agg(service.*) -> 0 AS service_details`),
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
    .whereIn('service.store_service_category_item', storeServiceCategoryItems)
    .andWhere('service.is_deleted', false)
    .andWhere({ 'employee.is_deleted': false, 'employee.is_active': true })
    .andWhere({ 'schedule.is_active': true, 'schedule.is_deleted': false })
    .groupBy('service.store_employee')
    .having(
      knex.raw(`COUNT(DISTINCT service.store_service_category_item) = ?`, [
        storeServiceCategoryItems.length,
      ])
    );

  const employeeList = findEmployees.map(async (item) => {
    delete item.service_details.store_employee;
    item = { ...item, ...item.service_details };
    delete item.service_details;

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

  const promiseQuery = await Promise.all(employeeList);

  return promiseQuery;
};

const gerBarbersAppointment = async (params) => {
  const appointment = await knex('store_appointment')
    .select('*')
    .whereIn('store_employee', params.storeEmployees)
    .andWhere('status', APPOINTMENT_STATUS.NEW)
    .andWhere(
      knex.raw('appointment_time::date = date(?)', [
        moment(params.linedUpDate).format('YYYY-MM-DD'),
      ])
    );

  return toCamelCase(appointment);
};

module.exports = {
  getBarbers,
  gerBarbersAppointment,
};
