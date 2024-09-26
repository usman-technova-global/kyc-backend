const Model = require('./theme.model');
const MODULE = require('../../../utils/constants/moduleNames');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const findResult = await Model.list(param);
    if (findResult) {
      result.items.list = findResult.totalList;
      result.items.total = parseInt(findResult.total, 10);
      result.message = `${MODULE.THEME} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch theme list.`;
      logger.error(`Unable to fetch theme list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch theme list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const lovList = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const findResult = await Model.lovList();
    if (findResult) {
      result.items.list = findResult.totalList;
      result.items.total = parseInt(findResult.total, 10);
      result.message = `${MODULE.THEME} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch theme list.`;
      logger.error(`Unable to fetch theme list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch theme list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const search = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const findResult = await Model.search(param);
    if (findResult) {
      result.items.list = findResult.totalList;
      result.items.total = parseInt(findResult.total, 10);
      result.message = `${MODULE.THEME} search list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch theme search list.`;
      logger.error(`Unable to fetch theme search list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch theme search list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const create = async (body, logger) => {
  let newData = body;
  let result = { hasError: false };
  try {
    newData = caseConversion.toSnakeCase(newData);
    const insertData = await Model.create(newData);
    if (insertData) {
      result = { ...result, item: insertData };
      result.message = `result have been created successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to create ${MODULE.THEME}. please check the payload.`;
      logger.error(
        `Unable to create ${MODULE.THEME}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.THEME} unable to create vouchers.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const update = async (id, body, logger) => {
  let newData = body;
  let result = { hasError: false };
  try {
    newData = caseConversion.toSnakeCase(newData);
    const updatedData = await Model.update(id, newData);
    if (updatedData) {
      result = { ...result, item: updatedData };
      result.message = `result have been updated successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to update ${MODULE.THEME}. please check the payload.`;
      logger.error(
        `Unable to update ${MODULE.THEME}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.THEME} unable to update theme.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const find = async (id, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.findById(id);
    if (findResult) {
      result.item = findResult;
      result.message = `${MODULE.THEME} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch theme list.`;
      logger.error(`Unable to fetch theme list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch theme list.
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
  search,
  find,
  lovList,
  update,
};
