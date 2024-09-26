const userModel = require('./user.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await userModel.count();
    const userList = await userModel.list(param, logger);
    if (userList) {
      result.items.list = userList;
      result.items.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.`;
      logger.error(`Unable to fetch role list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list role list.
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
    const total = await userModel.countWithSearch(param);
    const dataList = await userModel.search(param);
    if (dataList) {
      result.items.list = dataList;
      result.items.total = parseInt(total.rows[0].count, 10);
      result.message = `${moduleName} search list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch search list.`;
      logger.error(`Unable to fetch search list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch search list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const detail = async (moduleName, userId, logger) => {
  let result = { hasError: false };
  try {
    const resultData = await userModel.detail(userId);
    if (resultData && Object.keys(resultData).length > 0) {
      const tempData = resultData;
      delete tempData.password;
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        userId:: ${userId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${userId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = { list, search, detail };
