const Model = require('./shopType.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');
const { prettyPrintJSON } = require('../../../utils/commonUtils/prettyPrintJSON');

const list = async (moduleName, param, query, logger) => {
  const result = {
    hasError: false,
    items: { list: [], total: 0 },
  };
  let uriParams = {
    ...param,
    ...query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
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

const create = async (body, logger) => {
  let newData = body;
  let result = { hasError: false };
  try {
    newData = caseConversion.toSnakeCase(newData);
    const insertData = await Model.create(newData);
    if (insertData) {
      const [setInsertedDate] = insertData
      result = { ...result, items: setInsertedDate };
      result.message = `result have been created successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to create ${MODULE.SHOPTYPE}. please check the payload.`;
      logger.error(
        `Unable to create ${MODULE.SHOPTYPE}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.SHOPTYPE} unable to create vouchers.
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
      result.message = `${MODULE.SHOPTYPE} list has been fetched successfully.`;
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

const update = async (id, body, logger) => {
  let newData = body;
  let result = { hasError: false };
  try {
    newData = caseConversion.toSnakeCase(newData);
    const updatedData = await Model.update(id, newData);
    if (updatedData) {
      const [setUpdatedData] = updatedData
      result = { ...result, item: setUpdatedData };
      result.message = `result have been updated successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to update ${MODULE.SHOPTYPE}. please check the payload.`;
      logger.error(
        `Unable to update ${MODULE.SHOPTYPE}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.SHOPTYPE} unable to update theme.
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

const updateStatus = async (id, body, logger) => {
  let newData = body;
  let result = { hasError: false };
  try {
    newData = caseConversion.toSnakeCase(newData);
    const updatedData = await Model.update(id, newData);
    if (updatedData) {
      newData.id = id;
      result = { ...result, item: newData };
      result.message = `result have been updated successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to update ${MODULE.SHOPTYPE}. please check the payload.`;
      logger.error(
        `Unable to update ${MODULE.SHOPTYPE}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.SHOPTYPE} unable to update status.
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

module.exports = {
  list,
  create,
  find,
  update,
  updateStatus
};
