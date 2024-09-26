const orderModel = require('./order.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const appUserModel = require('../../../app/appUser/appUser.model');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
// const driverModel = require('../../driver/appDriver/driver.model');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, orders: { list: [], total: 0 } };

  try {
    const total = await orderModel.count(param);
    const dataList = await orderModel.list(param);
    if (dataList) {
      result.orders.list = dataList;
      result.orders.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch order list.`;
      logger.error(`Unable to fetch order list`);
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
  const result = { hasError: false, orders: { list: [], total: 0 } };
  try {
    const searchList = await appUserModel.findByString(param.search);
    if (searchList) {
      const total = await orderModel.countWhereIn(searchList[0].ids, param);
      const dataList = await orderModel.search(param, searchList[0].ids);
      if (dataList) {
        result.orders.list = dataList;
        result.orders.total = parseInt(total[0].count, 10);
        result.message = `${moduleName} list has been fetched successfully.`;
        result.code = HTTP_STATUS.OK;
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch order list.`;
      logger.error(`Unable to fetch order list`);
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

const view = async (moduleName, id, logger) => {
  const result = { hasError: false };
  try {
    const tempList = await orderModel.view(id, logger);
    if (tempList && tempList.length > 0) {
      const tempData = tempList[0];
      const driverHistory = tempData.app_order_delivery_statuses;
      if (driverHistory.length > 0) {
        const assignDriver = driverHistory[0];
        const driver = await orderModel.getDriverData(assignDriver.app_user);
        // console.log('driver::::::', driver);
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

      result.data = tempData;
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} result does not found.
        UserId:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${id}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const orderHistory = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const tempList = await orderModel.orderHistory(uriParams);
    result.data = tempList;
    result.message = `${moduleName} has been fetched successfully.`;
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${uriParams.orderId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const getItems = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findData = await orderModel.getItems(uriParams);
    result.data = findData;
    result.message = `${moduleName} has been fetched successfully.`;
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${uriParams.appOrder}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = { list, search, view, orderHistory, getItems };
