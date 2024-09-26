// const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
// const XLSX = require('xlsx');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
// const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const Model = require('./projects.model');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');

const list = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.projectListService(uriParams);
    if (findResult) {
      result.items.total = parseInt(findResult.total, 10);
      result.items.list = findResult.totalList;
      result = { ...result };
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

const listLOV = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.projectLOVService(uriParams);
    if (findResult) {
      result.items.total = parseInt(findResult.total, 10);
      result.items.list = findResult.totalList;
      result = { ...result };
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
  let newBody = body;
  let result = { hasError: false };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.create(newBody);
    // console.log('🚀 ~ create ~ insertData:', insertData);
    if (insertData) {
      const [setInsertedDate] = insertData;
      result = { ...result, item: setInsertedDate };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
      Payload:: ${prettyPrintJSON(result)}`
      );
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to create ${moduleName}.
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

const update = async (moduleName, id, body, logger) => {
  let newData = body;
  let result = { hasError: false };
  try {
    newData = caseConversion.toSnakeCase(newData);
    const updatedData = await Model.update(newData, id);
    if (updatedData) {
      const [setUpdatedData] = updatedData;
      result = { ...result, item: setUpdatedData };
      result.message = `result have been updated successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to update ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to update ${moduleName}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} unable to update theme.
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
  update,
  listLOV,
};
