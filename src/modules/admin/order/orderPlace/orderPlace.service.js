const Model = require('./orderPlace.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const getCartByUser = async (moduleName, userData, logger) => {
  let newUserData = userData;
  let appCart = { hasError: false };
  try {
    newUserData = caseConversion.toSnakeCase(newUserData);
    const result = await Model.getCartByUser(newUserData);
    if (result) {
      appCart = { ...appCart, cartId: result };
      appCart.message = `user cart fetched successfully`;
    } else {
      appCart.hasError = true;
      appCart.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCart.message = `Unable to fetch user cart`;
      logger.error(
        `Unable to fetch user cart ${moduleName}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while fetching user cart. ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appCart.hasError = true;
    appCart.message = error.detail;
    appCart.code = error.code;
  }
  return caseConversion.toCamelCase(appCart);
};

const categoryList = async (moduleName, param, logger) => {
  const result = { hasError: false };
  try {
    const dataList = await Model.categoryList(param);
    if (dataList) {
      result.items = dataList;
      result.message = `${moduleName} category list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch category list.`;
      logger.error(`Unable to fetch category list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list category list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const catItemList = async (moduleName, param, logger) => {
  const result = { hasError: false };
  try {
    const dataList = await Model.catItemList(param);
    if (dataList) {
      result.items = dataList;
      result.message = `${moduleName} category Item list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch category item list.`;
      logger.error(`Unable to fetch category item list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list category item list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateCart = async (moduleName, cartData, logger) => {
  let newCartData = cartData;
  let appCart = { hasError: false };
  try {
    newCartData = caseConversion.toSnakeCase(newCartData);
    const result = await Model.updateCart(newCartData);
    if (result) {
      appCart = { ...appCart, user: result };
      appCart.message = `cart has been updated`;
    } else {
      appCart.hasError = true;
      appCart.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCart.message = `Unable to update cart`;
      logger.error(
        `Unable to update cart ${MODULE.APP.USER_CART}.
        Payload:: ${prettyPrintJSON(newCartData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while updating the cart. ${MODULE.APP.USER_CART}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newCartData)}`
    );
    appCart.hasError = true;
    appCart.message = error.detail;
    appCart.code = error.code;
  }
  return caseConversion.toCamelCase(appCart);
};

const newOrder = async (moduleName, orderData, logger) => {
  let newOrderData = orderData;
  let appOrder = { hasError: false };
  try {
    newOrderData = caseConversion.toSnakeCase(newOrderData);
    const result = await Model.newOrder(newOrderData);
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
  return caseConversion.toCamelCase(appOrder);
};

module.exports = {
  getCartByUser,
  categoryList,
  catItemList,
  updateCart,
  newOrder,
};
