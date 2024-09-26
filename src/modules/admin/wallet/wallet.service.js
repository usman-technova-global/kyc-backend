const Model = require('./wallet.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (moduleName, uriParams, logger) => {
  const result = {
    hasError: false,
    items: { list: [], total: 0 },
  };
  try {
    const findList = await Model.list(uriParams);
    if (findList) {
      result.items.list = findList.totalList;
      result.items.total = parseInt(findList.total, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const create = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    // console.log('newBody::::::', newBody);
    const createResult = await Model.create(uriParams, newBody);
    // console.log('createResult:::::::', createResult);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} has been created successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}.`;
      logger.error(`Unable to create ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    // console.log('error', error);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateWallet = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    // console.log('newBody::::::', newBody);
    const updateResult = await Model.updateWallet(uriParams, newBody);
    // console.log('createResult:::::::', createResult);
    if (updateResult) {
      result.item = updateResult;
      result.message = `${moduleName} has been updated successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}.`;
      logger.error(`Unable to update ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    // console.log('error', error);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const transactions = async (uriParams, logger) => {
  const result = { hasError: false };
  try {
    const searchResult = await Model.transactions(uriParams);
    if (searchResult) {
      result.item = searchResult;
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch wallet transactions history list.`;
      logger.error(`Unable to fetch wallet transactions history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch wallet transactions history list.
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
  create,
  updateWallet,
  transactions,
};
