const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const MODULE = require('../../../../utils/constants/moduleNames');
const { modelHelper } = require('../../../../utils/commonUtils/crudHelper');
const knexConnection = require('../../../../config/databaseConnection');
const { findById } = require('../appSetting/setting.model');

const Table = MODULE.SHOP_EVENT_HOLIDAYS;

/**
 * Calculates the start and end dates of the month for the given date.
 *
 * @param {Date} date - The input date.
 * @returns {Object} An object containing the start and end dates of the month.
 *                   The object has the following structure:
 *                   {
 *                     startOfMonth: Date, // The start date of the month
 *                     endOfMonth: Date    // The end date of the month
 *                   }
 */
const getStartAndEndOfMonth = (date) => {
  const startDate = new Date(date);
  const startMonth = startDate.getMonth() + 1;

  const startOfMonth = new Date(startDate.getFullYear(), startMonth - 1, 1);
  const endOfMonth = new Date(startDate.getFullYear(), startMonth, 0);

  return {
    startOfMonth,
    endOfMonth,
  };
};

/**
 * Retrieves events for a specific month belonging to the given tenant.
 *
 * @param {string} tenant - The tenant identifier.
 * @param {Date} date - The date within the month for which events are to be retrieved.
 * @returns {Promise<Array>} A promise that resolves to an array of events for the specified month.
 */
const getMonthEvents = async (tenant, date) => {
  const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(date);

  const query = `
   tenant = '${tenant}' AND is_deleted = false  AND start_date >= '${moment(startOfMonth).format('YYYY-MM-DD')}' AND start_date < '${moment(endOfMonth).format('YYYY-MM-DD')}'
 `;

  const events = await modelHelper(Table, 'get', null, null, query);
  return events;
};

/**
 * Sets events for a specific month for the given tenant, replacing existing events.
 *
 * @param {string} tenant - The tenant identifier.
 * @param {Array<Object>} holidays - An array of objects representing holiday events to be set.
 * @param {Date|null} date - The date within the month for which events are to be set. If null, uses the current date.
 * @returns {Promise<Array>|boolean} A promise that resolves to an array of events for the specified month if successful, otherwise false.
 */
const setMonthEvent = async (tenant, holidays = [], date = null) => {
  const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(date);

  const query = `
     tenant = '${tenant}' AND start_date >= '${moment(startOfMonth).format('YYYY-MM-DD')}' AND start_date < '${moment(endOfMonth).format('YYYY-MM-DD')}'
   `;

  await modelHelper(Table, 'update', null, { is_deleted: true }, query);

  const events = holidays.map((holiday) => ({
    tenant,
    id: uuidv4(),
    event: holiday.event,
    start_date: holiday.start_date,
    end_date: holiday.end_date,
  }));

  let insertion = true;
  if (events.length > 0) {
    insertion = await modelHelper(Table, 'store', null, events, null);
  }

  if (insertion) {
    const data = await getMonthEvents(tenant, date);
    return data;
  }
  return insertion;
};

/**
 * Updates the shop schedule configuration for a specific tenant.
 *
 * @param {string} id - The ID of the tenant configuration.
 * @param {Object} data - The updated shop schedule configuration data.
 * @returns {Promise<number>} A promise that resolves to the number of rows affected by the update operation.
 */
const setTenantConfigShopSchedule = async (id, data) => {
  const tenantConfig = await findById(id);

  const tenantConfigUpdate = knexConnection(MODULE.TENANT_CONFIG)
    .update(data)
    .where('id', tenantConfig.id);

  const finalResult = await Promise.all([tenantConfigUpdate]);
  return finalResult[0];
};

module.exports = {
  getMonthEvents,
  setMonthEvent,
  setTenantConfigShopSchedule,
};
