const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appUserCartModel = require('./appUserCart.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function updateCart(cartData) {
  let newCartData = cartData;
  let appCart = { hasError: false };
  try {
    newCartData = toSnakeCase(newCartData);
    const result = await appUserCartModel.updateCart(newCartData);
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
  return toCamelCase(appCart);
}

async function getCartByUser(userData) {
  let newUserData = userData;
  let appCart = { hasError: false };
  try {
    newUserData = toSnakeCase(newUserData);
    const result = await appUserCartModel.getCartByUser(newUserData);
    if (result) {
      appCart = { ...appCart, cartId: result };
      appCart.message = `user cart fetched successfully`;
    } else {
      appCart.hasError = true;
      appCart.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCart.message = `Unable to fetch user cart`;
      logger.error(
        `Unable to fetch user cart ${MODULE.APP.USER_CART}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while fetching user cart. ${MODULE.APP.USER_CART}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appCart.hasError = true;
    appCart.message = error.detail;
    appCart.code = error.code;
  }
  return toCamelCase(appCart);
}
async function getCartByDevice(deviceData) {
  let newDeviceData = deviceData;
  let appCart = { hasError: false };
  try {
    newDeviceData = toSnakeCase(newDeviceData);
    const result = await appUserCartModel.getCartByDevice(newDeviceData);
    if (result) {
      appCart = { ...appCart, cartId: result };
      appCart.message = `device cart fetched successfully`;
    } else {
      appCart.hasError = true;
      appCart.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCart.message = `Unable to fetch device cart`;
      logger.error(
        `Unable to fetch device cart ${MODULE.APP.USER_CART}.
        Payload:: ${prettyPrintJSON(newDeviceData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while fetching device cart. ${MODULE.APP.USER_CART}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newDeviceData)}`
    );
    appCart.hasError = true;
    appCart.message = error.detail;
    appCart.code = error.code;
  }
  return toCamelCase(appCart);
}

module.exports = {
  updateCart,
  getCartByUser,
  getCartByDevice,
};
