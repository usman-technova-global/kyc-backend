const knex = require('../../../config/databaseConnection');
const { NOTIFICATION_TYPE } = require('../../../utils/constants/enumConstants');
const MODULE = require('../../../utils/constants/moduleNames');

const create = async (data) =>
  knex(MODULE.NOTIFICATION).insert(data).returning('*');

const activeTokenCounts = async (data) => {
  // console.log('activeTokenCounts:::::', data);
  let counts;
  if (data.notificationType === NOTIFICATION_TYPE.CUSTOMERS) {
    counts = knex(MODULE.APP.USER_DEVICE)
      .countDistinct('token')
      .where('tenant', data.tenant)
      .where('is_notification_allowed', true)
      .andWhere('token', '!=', 'undefined')
      .whereNotNull('token');
  } else {
    counts = knex(MODULE.STORE.EMPLOYEE_DEVICE)
      .countDistinct('token')
      .where('tenant', data.tenant)
      .where('is_notification_allowed', true)
      .andWhere('token', '!=', 'undefined')
      .whereNotNull('token');
  }
  return counts;
};

const getDeviceTokens = (offset, size, data) => {
  // console.log('getDeviceTokens:::::', data);
  const columns = ['token'];
  let deviceokens;
  if (data.notificationType === NOTIFICATION_TYPE.CUSTOMERS) {
    deviceokens = knex
      .select(columns)
      .distinct('token')
      .from(MODULE.APP.USER_DEVICE)
      .where('tenant', data.tenant)
      .where('is_notification_allowed', true)
      .andWhere('token', '!=', 'undefined')
      .whereNotNull('token')
      .offset(offset * size)
      .limit(size);
  } else {
    deviceokens = knex
      .select(columns)
      .distinct('token')
      .from(MODULE.STORE.EMPLOYEE_DEVICE)
      .where('tenant', data.tenant)
      .where('is_notification_allowed', true)
      .andWhere('token', '!=', 'undefined')
      .whereNotNull('token')
      .offset(offset * size)
      .limit(size);
  }
  return deviceokens;
};

const notificationBatchCreate = async (data) =>
  knex(MODULE.NOTIFICATION_BATCH).insert(data);

const notificationStatusCheck = (id) => {
  const columns = ['status'];
  return knex.select(columns).from(MODULE.NOTIFICATION).where('id', id);
};

const updateNotificationStatus = async (data, id) =>
  knex(MODULE.NOTIFICATION).update(data).where('id', id);

const getNotification = async (id) => {
  const columns = ['id', 'title', 'description', 'status'];
  return knex.select(columns).from(MODULE.NOTIFICATION).where('id', id);
};

const updateAppUserDeviceStatus = async (data, token) =>
  knex(MODULE.APP.USER_DEVICE).update(data).where('token', token);

module.exports = {
  create,
  activeTokenCounts,
  getDeviceTokens,
  notificationBatchCreate,
  notificationStatusCheck,
  updateNotificationStatus,
  getNotification,
  updateAppUserDeviceStatus,
};
