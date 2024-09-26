const cartModel = require('./cart.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const appUserModel = require('../../../app/appUser/appUser.model');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, carts: { list: [], total: 0 } };

  try {
    const total = await cartModel.count(param);
    const dataList = await cartModel.list(param);
    if (dataList) {
      result.carts.list = dataList;
      result.carts.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = 'Unable to fetch order list.';
      logger.error('Unable to fetch order list');
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list order list.
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
  const result = { hasError: false, carts: { list: [], total: 0 } };
  try {
    const searchList = await appUserModel.findByString(param.search);
    if (searchList) {
      const total = await cartModel.countWhereIn(searchList[0].ids, param);
      const dataList = await cartModel.search(param, searchList[0].ids);
      if (dataList) {
        result.carts.list = dataList;
        result.carts.total = parseInt(total[0].count, 10);
        result.message = `${moduleName} list has been fetched successfully.`;
        result.code = HTTP_STATUS.OK;
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = 'Unable to fetch order list.';
      logger.error('Unable to fetch order list');
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list order list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const view = async (moduleName, param, logger) => {
  const result = { hasError: false };
  try {
    const tempList = await cartModel.view(param.cartId);
    if (tempList && tempList.length > 0) {
      const tempData = tempList[0];
      const mergedArray = tempData.app_user_cart_items.map((cartItem) => {
        const matchingItem = tempData.home_cat_items.find(
          (item) => item.id === cartItem.item_id
        );
        if (matchingItem) {
          return {
            ...cartItem,
            name: matchingItem.name,
            icon: matchingItem.icon,
          };
        }
        return cartItem;
      });
      delete tempData.home_cat_items;
      delete tempData.app_user_cart_items;
      tempData.app_user_cart_items = mergedArray;
      result.data = tempData;
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} result does not found. cartId:: ${param.cartId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found, cartId:: ${param.cartId}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = { list, search, view };
