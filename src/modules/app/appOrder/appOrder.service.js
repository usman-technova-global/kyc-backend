const axios = require('axios');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appOrderModel = require('./appOrder.model');
const orderModel = require('../../admin/order/appOrder/order.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function getList(userData) {
  let newUserData = userData;
  let appOrderList = { hasError: false };
  try {
    newUserData = toSnakeCase(newUserData);
    const result = await appOrderModel.getList(newUserData);
    if (result) {
      appOrderList = { ...appOrderList, data: result };
      appOrderList.message = `order(s) fetched successfully`;
    } else {
      appOrderList.hasError = true;
      appOrderList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrderList.message = `Unable fetch order`;
      logger.error(
        `Unable fetch order ${MODULE.APP.ORDER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred fetching order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appOrderList.hasError = true;
    appOrderList.message = error.detail;
    appOrderList.code = error.code;
  }
  return toCamelCase(appOrderList);
}

async function getOrderDetail(userData) {
  let newUserData = userData;
  let result = { hasError: false };
  try {
    newUserData = toSnakeCase(newUserData);
    const [getResult] = await appOrderModel.orderDetail(newUserData);
    if (getResult) {
      const tempData = getResult;
      const driverHistory = tempData.app_order_delivery_statuses;
      if (driverHistory.length > 0) {
        const assignDriver = driverHistory[0];
        const driver = await orderModel.getDriverData(assignDriver.app_user);
        tempData.driver = {
          first_name: driver.first_name,
          last_name: driver.last_name,
          email: driver.email,
          phone: driver.phone,
          license_number: driver.license_number,
          avatar: driver.avatar,
        };
      } else {
        tempData.driver = null;
      }
      const mergeArray = tempData.order_items.map((orderItem) => {
        const matchingItem = tempData.home_cat_items.find(
          (item) => item.id === orderItem.item_id
        );
        if (matchingItem) {
          return {
            ...orderItem,
            name: matchingItem.name,
            icon: matchingItem.icon,
          };
        }
        return orderItem;
      });
      delete tempData.home_cat_items;
      delete tempData.order_items;
      delete tempData.app_order_delivery_statuses;
      tempData.order_items = mergeArray;

      result = { ...result, item: tempData };
      result.message = `order detail fetched successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch order detail`;
      logger.error(
        `Unable to fetch order detail ${MODULE.APP.ORDER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while fetching order detail. ${MODULE.APP.ORDER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return toCamelCase(result);
}

async function getOrderList(userData) {
  let newUserData = userData;
  let appOrderList = { hasError: false };
  try {
    newUserData = toSnakeCase(newUserData);
    const result = await appOrderModel.getOrderList(newUserData);
    if (result) {
      appOrderList = { ...appOrderList, data: result };
      appOrderList.message = `order(s) fetched successfully`;
    } else {
      appOrderList.hasError = true;
      appOrderList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrderList.message = `Unable fetch order`;
      logger.error(
        `Unable fetch order ${MODULE.APP.ORDER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred fetching order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appOrderList.hasError = true;
    appOrderList.message = error.detail;
    appOrderList.code = error.code;
  }
  return toCamelCase(appOrderList);
}

async function newOrder(orderData) {
  let newOrderData = orderData;
  let appOrder = { hasError: false };
  try {
    newOrderData = toSnakeCase(newOrderData);
    const result = await appOrderModel.newOrder(newOrderData);
    if (result) {
      appOrder = { ...appOrder, data: result };
      appOrder.message = `order has been placed`;
    } else {
      appOrder.hasError = true;
      appOrder.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrder.message = `Unable to place order`;
      logger.error(
        `Unable to place order ${MODULE.APP.ORDER}.
        Payload:: ${prettyPrintJSON(newOrderData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while placing order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newOrderData)}`
    );
    appOrder.hasError = true;
    appOrder.message = error.detail;
    appOrder.code = error.code;
  }
  return toCamelCase(appOrder);
}

async function newOrderCash(orderData) {
  let newOrderData = orderData;
  let appOrder = { hasError: false };
  try {
    newOrderData = toSnakeCase(newOrderData);
    const result = await appOrderModel.newOrderCash(newOrderData);
    if (result) {
      appOrder = { ...appOrder, data: result };
      appOrder.message = `order has been placed`;
    } else {
      appOrder.hasError = true;
      appOrder.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrder.message = `Unable to place order`;
      logger.error(
        `Unable to place order ${MODULE.APP.ORDER}.
        Payload:: ${prettyPrintJSON(newOrderData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while placing order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newOrderData)}`
    );
    appOrder.hasError = true;
    appOrder.message = error.detail;
    appOrder.code = error.code;
  }
  return toCamelCase(appOrder);
}

async function newOrderPayFast(orderData) {
  let newOrderData = orderData;
  let appOrder = { hasError: false };
  try {
    newOrderData = toSnakeCase(newOrderData);
    const result = await appOrderModel.newOrderPayFast(newOrderData);
    if (result) {
      appOrder = { ...appOrder, data: result };
      appOrder.message = `order has been placed`;
    } else {
      appOrder.hasError = true;
      appOrder.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrder.message = `Unable to place order`;
      logger.error(
        `Unable to place order ${MODULE.APP.ORDER}.
        Payload:: ${prettyPrintJSON(newOrderData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while placing order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newOrderData)}`
    );
    appOrder.hasError = true;
    appOrder.message = error.detail;
    appOrder.code = error.code;
  }
  return toCamelCase(appOrder);
}

async function orderStatusUpdate(sessionId) {
  try {
    const result = await appOrderModel.orderStatusUpdate(sessionId);
    if (result) {
      return result;
    }
    return null;
  } catch (error) {
    logger.error(
      `An error occurred updating order status. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      SessionId:: ${sessionId}`
    );
    return null;
  }
}

async function orderStatusUpdatePayFast(orderId) {
  try {
    const result = await appOrderModel.orderStatusUpdatePayFast(orderId);
    if (result) {
      return result;
    }
    return null;
  } catch (error) {
    logger.error(
      `An error occurred updating order status. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}
      OrderId:: ${orderId}`
    );
    return null;
  }
}

async function storeStripeLogs(log) {
  const newLog = toSnakeCase(log);
  return appOrderModel.storeStripeLogs(newLog);
}

async function getPayfastAccessToken() {
  let appOrder = { hasError: false };
  const BASE_URL = `${process.env.WEB_SERVER_PROTOCOL}://${process.env.REDIRECT_HOST}${process.env.WEB_SERVER_BASEPATH}/public`;
  const PAYFAST_WEB_HOOK_URL = `${process.env.WEB_SERVER_PROTOCOL}://${process.env.REDIRECT_HOST}${process.env.WEB_SERVER_BASEPATH}/app/appOrder/pay-fast/webhook`;
  const data = {
    MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID,
    SECURED_KEY: process.env.PAYFAST_SECURED_KEY,
  };
  try {
    const response = await axios.post(
      'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken',
      data
    );
    if (response.status === HTTP_STATUS.OK) {
      if (!response.data.ACCESS_TOKEN) {
        const payFastError = new Error(response.data.errorDescription);
        payFastError.detail = response.data.errorDescription;
        payFastError.errorCode = response.data.errorCode;
        throw payFastError;
      }

      appOrder = {
        ...appOrder,
        data: {
          ...response.data,
          success_url: `${BASE_URL}/success.html`,
          cancel_url: `${BASE_URL}/cancel.html`,
          pay_fast_hook_url: PAYFAST_WEB_HOOK_URL,
        },
      };
      appOrder.message = `access token has been sent`;
    } else {
      appOrder.hasError = true;
      appOrder.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrder.message = `unable to create access token`;
      logger.error(`unable to create access token ${MODULE.APP.ORDER}`);
    }
  } catch (error) {
    logger.error(
      `An error occurred while getting access token order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    appOrder.hasError = true;
    appOrder.message = error.detail;
    appOrder.code = error.code;
  }
  return toCamelCase(appOrder);
}
async function storePayFastLogs(log) {
  return appOrderModel.storePayFastLogs(log);
}

module.exports = {
  getOrderList,
  newOrder,
  orderStatusUpdate,
  storeStripeLogs,
  getList,
  getOrderDetail,
  storePayFastLogs,
  getPayfastAccessToken,
  orderStatusUpdatePayFast,
  newOrderPayFast,
  newOrderCash,
};
