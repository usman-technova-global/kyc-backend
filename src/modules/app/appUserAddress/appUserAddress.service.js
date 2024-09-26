const { v4: uuidv4 } = require('uuid');
const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');

const appUserAddressModel = require('./appUserAddress.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function appUserAddress(addressData) {
  let newAddressData = addressData;
  let appAddress = { hasError: false };
  try {
    newAddressData.id = uuidv4();
    newAddressData.is_active = true;
    newAddressData.createdDate = new Date();
    newAddressData.updatedDate = new Date();
    newAddressData = toSnakeCase(newAddressData);
    const result = await appUserAddressModel.appUserAddress(newAddressData);
    if (result && result.rowCount > 0) {
      appAddress = { ...appAddress, user: newAddressData };
      appAddress.message = `user address has been added successfully.`;
    } else {
      appAddress.hasError = true;
      appAddress.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appAddress.message = `Unable to add user address, please check the payload.`;
      logger.error(
        `Unable to add user address ${MODULE.APP.USER_ADDRESS}.
        Payload:: ${prettyPrintJSON(newAddressData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to add user address ${MODULE.APP.USER_ADDRESS}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newAddressData)}`
    );
    appAddress.hasError = true;
    appAddress.message = error.detail;
    appAddress.code = error.code;
  }
  return toCamelCase(appAddress);
}

async function listUserAddress(userId, tenantId) {
  const result = { hasError: false, list: [] };
  try {
    const dataList = await appUserAddressModel.listUserAddress(
      userId,
      tenantId
    );
    if (dataList) {
      result.list = dataList;
      result.message = `${MODULE.APP.USER_ADDRESS} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${MODULE.APP.USER_ADDRESS} list.`;
      logger.error(`Unable to fetch ${MODULE.APP.USER_ADDRESS} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${MODULE.APP.USER_ADDRESS} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return toCamelCase(result);
}

async function deleteUserAddress(data) {
  let newData = data;
  let result = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const tempUserAddress =
      await appUserAddressModel.deleteUserAddress(newData);
    if (tempUserAddress > 0) {
      newData.is_deleted = true;
      result = { ...result, item: newData };
      result.message = `Address have been deleted successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to delete ${MODULE.APP.USER_ADDRESS}. please check the payload.`;
      logger.error(
        `Unable to delete ${MODULE.APP.USER_ADDRESS}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.APP.USER_ADDRESS} unable to delete address.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return toCamelCase(result);
}

async function updateStatusUserAddress(data) {
  let newData = data;
  let result = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const getResult = await appUserAddressModel.findById(newData.id);
    if (getResult && getResult !== null) {
      const updateResult = await appUserAddressModel.updateStatus(getResult);
      if (updateResult) {
        newData.is_active = true;
        result = { ...result, item: newData };
        result.message = `Address have been status update successfully.`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.NOT_FOUND;
        result.message = `Unable to status update ${MODULE.APP.USER_ADDRESS}. please check the payload.`;
        logger.error(
          `Unable to status update ${MODULE.APP.USER_ADDRESS}.
          Payload:: ${prettyPrintJSON(newData)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to status update ${MODULE.APP.USER_ADDRESS}. please check the payload.`;
      logger.error(
        `Unable to status update ${MODULE.APP.USER_ADDRESS}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.APP.USER_ADDRESS} unable to status update address.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return toCamelCase(result);
}

module.exports = {
  appUserAddress,
  listUserAddress,
  deleteUserAddress,
  updateStatusUserAddress,
};
