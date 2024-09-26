/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
const { v4: uuidv4 } = require('uuid');
const notificationModel = require('./notificationModel');
const pushNotification = require('../../../utils/pushNotification/notification');
const {
  PUSH_NOTIFICATION_BATCH,
  PUSH_NOTIFICATION_BATCH_DELL,
} = require('../../../utils/constants/queseConstants');
const { sendToQueue } = require('../../../utils/queues/rabbmitMqConnection');
const { toCamelCase } = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const {
  NOTIFICATION_STATUS_TYPE,
} = require('../../../utils/constants/enumConstants');

const logger = require('../../../utils/commonUtils/logger').consumerLogger;

const moduleNotificationName = 'Notification';
const moduleNotificationBatchName = 'Notification Batch';
const LIMIT_SIZE = 100;
const createNotification = async (data) => {
  let result = { hasError: false, notification: {} };
  try {
    const newData = {
      id: uuidv4(),
      title: data.title,
      description: data.message,
      status: NOTIFICATION_STATUS_TYPE.NEW,
      notification_type: data.notificationType,
      tenant: data.tenant,
      created_by: data.userId,
      updated_by: data.userId,
    };
    const createService = await notificationModel.create(newData);
    // console.log('createService:::::::', createService);
    if (createService) {
      result = { ...result, notification: createService };
      result.message = `${moduleNotificationName} has been created successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleNotificationName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleNotificationName}.
          Payload:: ${prettyPrintJSON(data)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleNotificationName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(data)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return toCamelCase(result);
};

const convertData = async (notificationData, getDeviceTokens, isLast) => {
  // console.log('convertData:::::', notificationData, getDeviceTokens);
  const deviceTokens = [];
  const regexPattern = /^[0-9a-zA-Z-_]{1,128}:APA91[a-zA-Z0-9-_]{100,200}$/g;
  getDeviceTokens.forEach((item) => {
    if (item.token.match(regexPattern)) deviceTokens.push(item.token);
  });
  const data = {
    tenant: notificationData.tenant,
    notification: notificationData.id,
    tokens: JSON.stringify(deviceTokens),
    isLast,
  };
  // console.log('data:::::::', data);
  try {
    sendToQueue(PUSH_NOTIFICATION_BATCH, data);
  } catch (error) {
    logger.error(
      `Unable to create ${moduleNotificationName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(data)}`
    );
  }
};

const notificationBatchQuery = async (notificationData, offset, size) => {
  // console.log('notificationBatchQuery:::::', notificationData);
  for (let i = 0; i < offset; i++) {
    const notificationStatus = await notificationModel.notificationStatusCheck(
      notificationData.id
    );

    if (
      notificationStatus &&
      notificationStatus[0].status !== NOTIFICATION_STATUS_TYPE.CANCELLED
    ) {
      const getDeviceTokens = await notificationModel.getDeviceTokens(
        i,
        size,
        notificationData
      );
      // console.log('getDeviceTokens:::::::', getDeviceTokens);
      const isLast = i === offset - 1;
      convertData(notificationData, getDeviceTokens, isLast);
    }
  }
};

const notificationBatch = async (notificationData) => {
  let result = { hasError: false, notification: {} };
  // console.log('notificationBatch::::::', notificationData);
  try {
    const totalCountsQuery =
      await notificationModel.activeTokenCounts(notificationData);
    let totalCounts = 0;

    if (totalCountsQuery[0].count > 0) {
      totalCounts = parseInt(totalCountsQuery[0].count, 10);
      const offset = Math.ceil(totalCounts / LIMIT_SIZE);
      notificationBatchQuery(notificationData, offset, LIMIT_SIZE);
      result = { ...result, notification: notificationData };
      result.message = `${moduleNotificationBatchName} has been sent successfully.`;
    } else {
      const updateStatus = {
        status: NOTIFICATION_STATUS_TYPE.FAILED,
      };
      notificationModel.updateNotificationStatus(
        updateStatus,
        notificationData.id
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleNotificationBatchName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(notificationData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return toCamelCase(result);
};

const notificationSent = async (batchData) => {
  let result = { hasError: false };
  const status = batchData.isLast
    ? NOTIFICATION_STATUS_TYPE.COMPLETED
    : NOTIFICATION_STATUS_TYPE.SENDING;
  const getNotification = await notificationModel.getNotification(
    batchData.notification
  );
  let tempData;

  if (getNotification) {
    tempData = getNotification[0];
    tempData.tokens = JSON.parse(batchData.tokens);
    tempData.isLast = batchData.isLast;
    tempData.notification = batchData.notification;
    tempData.tenant = batchData.tenant;
    const notificationPush =
      await pushNotification.multicastNotification(tempData);

    // console.log('notificationPush::::::::', notificationPush);

    if (notificationPush && notificationPush.success) {
      const data = {
        id: uuidv4(),
        notification: tempData.notification,
        success: notificationPush.totalSuccess,
        failure: notificationPush.totalFailure,
        success_token: JSON.stringify(notificationPush.successTokens),
        failure_token: JSON.stringify(notificationPush.failureTokens),
      };
      const create = await notificationModel.notificationBatchCreate(data);
      if (create.rowCount > 0) {
        logger.info('Notification batch has been created successfully');
        const updateStatus = {
          status,
        };
        notificationModel.updateNotificationStatus(
          updateStatus,
          tempData.notification
        );
        const failureToken = JSON.parse(data.failure_token);
        if (failureToken.length > 0) {
          const appUserDeviceStatus = {
            is_notification_allowed: false,
          };
          failureToken.forEach((token) => {
            notificationModel.updateAppUserDeviceStatus(
              appUserDeviceStatus,
              token
            );
          });
        }
        result = { ...result, notification: data };
        result.success = true;
        result.hasError = false;
        result.message = `${moduleNotificationBatchName} has been created successfully.`;
      } else {
        const updateStatus = {
          status: NOTIFICATION_STATUS_TYPE.CANCELLED,
        };
        notificationModel.updateNotificationStatus(
          updateStatus,
          tempData.notification
        );
        logger.error(
          `Unable to create ${moduleNotificationBatchName}.
          Payload:: ${prettyPrintJSON(tempData)}`
        );
        result.hasError = true;
        result.message = `Unable to create ${moduleNotificationBatchName}.`;
        result.code = HTTP_STATUS.BAD_REQUEST;
      }
      return toCamelCase(result);
    }
    const updateStatus = {
      status: NOTIFICATION_STATUS_TYPE.CANCELLED,
    };
    notificationModel.updateNotificationStatus(
      updateStatus,
      tempData.notification
    );
    try {
      if (notificationPush.success) {
        sendToQueue(PUSH_NOTIFICATION_BATCH_DELL, batchData);
      }
    } catch (error) {
      logger.error(
        `Unable to create ${moduleNotificationBatchName}.
        Error:: ${error}
        Trace:: ${error.stack}`
      );
    }
  } else {
    const updateStatus = {
      status: NOTIFICATION_STATUS_TYPE.CANCELLED,
    };
    notificationModel.updateNotificationStatus(
      updateStatus,
      tempData.notification
    );
  }
  return toCamelCase(result);
};

module.exports = { createNotification, notificationBatch, notificationSent };
