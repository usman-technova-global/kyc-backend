/* eslint-disable prefer-destructuring */
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  PUSH_NOTIFICATION,
} = require('../../../../utils/constants/queseConstants');
const { sendToQueue } = require('../../../../utils/queues/rabbmitMqConnection');
const pushNotificationModel = require('./pushNotification.model');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const total = await pushNotificationModel.count(param);
    const dataList = await pushNotificationModel.list(param);
    if (dataList) {
      const tempData = dataList;
      result.items.list = tempData;
      result.items.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch notification list.`;
      logger.error(`Unable to fetch notification list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list notification list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const search = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await pushNotificationModel.countWithSearch(param);
    const dataList = await pushNotificationModel.search(param);
    if (dataList.rowCount > 0) {
      const tempData = dataList.rows;
      result.items.list = tempData;
      result.items.total = parseInt(total.rows[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch notification list.`;
      logger.error(`Unable to fetch notification list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list notification list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const sent = async (moduleName, body, logger) => {
  const result = { hasError: false };
  try {
    try {
      sendToQueue(PUSH_NOTIFICATION, body);
    } catch (error) {
      logger.error(
        `Unable to sent ${moduleName}.
        Error:: ${error}
        Trace:: ${error.stack}
        Payload:: ${prettyPrintJSON(body)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to sent ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(body)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const batchDetail = async (moduleName, param, logger) => {
  const result = { hasError: false, item: { success: 0, failure: 0 } };
  try {
    const detail = await pushNotificationModel.batchDetail(param.id);
    if (detail && detail.length > 0) {
      result.item = detail[0];
      result.message = `${moduleName} batch detail has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch notification batch detail.`;
      logger.error(`Unable to fetch notification batch detail`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch batch detail in notification batch detail.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = { sent, list, search, batchDetail };
