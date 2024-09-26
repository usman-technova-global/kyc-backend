const { v4: uuidv4 } = require('uuid');
const categoryServiceFaqModel = require('./categoryServiceFaq.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await categoryServiceFaqModel.count(param);
    const dataList = await categoryServiceFaqModel.list(param);
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
    const total = await categoryServiceFaqModel.countWithSearch(param);
    const dataList = await categoryServiceFaqModel.search(param);
    if (dataList) {
      result.items.list = dataList.rows;
      result.items.total = parseInt(total.rows[0].count, 10);
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

const create = async (moduleName, param, body, logger) => {
  const newBody = body;
  let result = { hasError: false };
  try {
    newBody.id = uuidv4();
    newBody.home_category_item = param.categoryServiceId;
    newBody.is_active = true;
    const categoryServiceResult = await categoryServiceFaqModel.create(newBody);
    if (categoryServiceResult && categoryServiceResult.rowCount > 0) {
      delete newBody.is_active;
      newBody.isActive = true;
      newBody.isDeleted = false;
      result = { ...result, item: newBody };
      result.message = `${moduleName} has been created successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
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

const findById = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const categoryData = await categoryServiceFaqModel.findById(
      param.categoryServiceFaqId
    );
    if (categoryData && categoryData.length > 0) {
      const tempData = categoryData[0];
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        categoryId:: ${param.categoryId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${param.categoryServiceFaqId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const update = async (moduleName, param, body, logger) => {
  let result = { hasError: false };
  try {
    const categoryServiceFaq = await categoryServiceFaqModel.findById(
      param.categoryServiceFaqId
    );
    if (categoryServiceFaq && categoryServiceFaq.length > 0) {
      const newResult = await categoryServiceFaqModel.update(
        body,
        param.categoryServiceFaqId
      );
      if (newResult) {
        result = { ...result, item: body };
        result.message = `${moduleName} has been updated successfully.`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
          Payload:: ${prettyPrintJSON(body)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the category service faq id.`;
      logger.error(
        `Unable to update ${moduleName}.
          Payload:: ${prettyPrintJSON(body)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
    Error:: ${error}
    Trace:: ${error.stack}
    Payload:: ${prettyPrintJSON(body)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

module.exports = { list, search, create, update, findById };
