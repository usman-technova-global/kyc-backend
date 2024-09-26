// const { v4: uuidv4 } = require('uuid');
const Model = require('./appointment.model');
const employeeModel = require('../employee/employee.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
// const {
//   prettyPrintJSON,
// } = require('../../../../utils/commonUtils/prettyPrintJSON');

const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.list(uriParams);
    if (findResult) {
      result.items = findResult;
      // result = { ...result };
      result.message = `${moduleName} today list fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} today list.`;
      logger.error(`Unable to fetch ${moduleName} today list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} today list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const today = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const isAvailable = await employeeModel.attendanceCheck(uriParams);
    if (!isAvailable.timeIn) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Today employee is not available.`;
      logger.error(`Today employee is not available`);
      return caseConversion.toCamelCase(result);
    }
    const findResult = await Model.today(uriParams);
    if (findResult) {
      result.items = findResult;
      // result = { ...result };
      result.message = `${moduleName} today list fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} today list.`;
      logger.error(`Unable to fetch ${moduleName} today list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} today list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const done = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.done(uriParams);
    if (findResult) {
      result.item = findResult;
      // result = { ...result };
      result.message = `${moduleName} successfully done.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to done ${moduleName}.`;
      logger.error(`Unable to done ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to done ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = {
  list,
  today,
  done,
};
