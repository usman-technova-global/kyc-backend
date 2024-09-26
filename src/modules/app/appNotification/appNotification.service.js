const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appNotificationModel = require('./appNotification.model');
const { toCamelCase } = require('../../../utils/commonUtils/caseConversion');

async function findByUserIdAndTenantId(data) {
  let notifications = { hasError: false };
  try {
    const tempNotifications =
      await appNotificationModel.findByUserIdAndTenantId(data);
    notifications = { ...notifications, notifications: tempNotifications };
    notifications.message = `Notifications have been fetched successfully.`;
  } catch (error) {
    logger.error(
      `${MODULE.APP.NOTIFICATION} does not found.
      UserId:: ${data.appUser}
      TenantId:: ${data.tenant}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    notifications.hasError = true;
    notifications.message = error.detail;
    notifications.code = error.code;
  }
  return toCamelCase(notifications);
}

module.exports = { findByUserIdAndTenantId };
