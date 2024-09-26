const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appOrderDeliveryModel = require('./appOrderDelivery.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function assignedOrders(driverData) {
  let newDriverData = driverData;
  let appOrderDeliveryList = { hasError: false };
  try {
    newDriverData = toSnakeCase(newDriverData);
    const result = await appOrderDeliveryModel.assignedOrders(newDriverData);
    if (result && result.orders.length > 0) {
      appOrderDeliveryList = { ...appOrderDeliveryList, data: result };
      appOrderDeliveryList.message = `assigned order(s) fetched successfully`;
    } else {
      appOrderDeliveryList.hasError = true;
      appOrderDeliveryList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrderDeliveryList.message = `orders list is empty`;
      logger.error(
        `${MODULE.APP.ORDER_DELIVERY} does not found.
        Payload:: ${prettyPrintJSON(newDriverData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred fetching order. ${MODULE.APP.ORDER_DELIVERY}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newDriverData)}`
    );
    appOrderDeliveryList.hasError = true;
    appOrderDeliveryList.message = error.detail;
    appOrderDeliveryList.code = error.code;
  }
  return toCamelCase(appOrderDeliveryList);
}

async function assignedOrderDetails(driverData) {
  let newDriverData = driverData;
  let appOrderDelivery = { hasError: false };
  try {
    newDriverData = toSnakeCase(newDriverData);
    const result =
      await appOrderDeliveryModel.assignedOrderDetails(newDriverData);
    if (result) {
      appOrderDelivery = { ...appOrderDelivery, data: result };
      appOrderDelivery.message = `assigned order fetched successfully`;
    } else {
      appOrderDelivery.hasError = true;
      appOrderDelivery.code = HTTP_STATUS.NOT_FOUND;
      appOrderDelivery.message = `order  not found`;
      logger.error(
        `${MODULE.APP.ORDER_DELIVERY} does not found.
        Payload:: ${prettyPrintJSON(newDriverData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred fetching order. ${MODULE.APP.ORDER_DELIVERY}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newDriverData)}`
    );
    appOrderDelivery.hasError = true;
    appOrderDelivery.message = error.detail;
    appOrderDelivery.code = error.code;
  }
  return toCamelCase(appOrderDelivery);
}

async function setOrderStatus(driverData) {
  let newDriverData = driverData;
  let newOrderStatus = { hasError: false };
  try {
    newDriverData = toSnakeCase(newDriverData);
    const result = await appOrderDeliveryModel.setOrderStatus(newDriverData);
    if (result) {
      newOrderStatus = { ...newOrderStatus, data: result };
      newOrderStatus.message = `order status set successfully`;
    } else {
      newOrderStatus.hasError = true;
      newOrderStatus.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      newOrderStatus.message = `unable to set order status`;
      logger.error(
        `${MODULE.APP.ORDER_DELIVERY} unable to set order status.
        Payload:: ${prettyPrintJSON(newDriverData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred setting order status. ${MODULE.APP.ORDER_DELIVERY}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newDriverData)}`
    );
    newOrderStatus.hasError = true;
    newOrderStatus.message = error.detail;
    newOrderStatus.code = error.code;
  }
  return toCamelCase(newOrderStatus);
}
module.exports = {
  assignedOrders,
  assignedOrderDetails,
  setOrderStatus,
};
