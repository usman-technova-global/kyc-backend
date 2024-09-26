const orderAssignModel = require('./orderAssign.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const total = await orderAssignModel.count(param);
    const dataList = await orderAssignModel.list(param);
    if (dataList) {
      result.items.list = dataList;
      result.items.total = parseInt(total[0].count, 10);
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
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const getIds = await orderAssignModel.findByString(param);
    if (getIds.rowCount > 0) {
      const total = await orderAssignModel.countWhereIn(
        getIds.rows[0].ids,
        param
      );
      const dataList = await orderAssignModel.search(param, getIds.rows[0].ids);
      if (dataList) {
        result.items.list = dataList;
        result.items.total = parseInt(total[0].count, 10);
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

const create = async (moduleName, body, logger) => {
  const newBody = body;
  let result = { hasError: false };
  try {
    const createRow = await orderAssignModel.create(newBody, logger);
    if (createRow && Object.keys(createRow).length > 0) {
      result = { ...result, item: newBody };
      result.message = `${moduleName} Delivery has been created successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName} Delivery. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName} Delivery.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to create ${moduleName} Delivery.
    Error:: ${error}
    Trace:: ${error.stack}
    Payload:: ${prettyPrintJSON(newBody)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = { list, search, create };
