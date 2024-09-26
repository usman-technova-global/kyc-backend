const { v4: uuidv4 } = require('uuid');
const Model = require('./service.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await Model.count(param);
    const findResult = await Model.list(param);
    if (findResult) {
      result.items.total = parseInt(total[0].count, 10);
      result.items.list = findResult;
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

const search = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await Model.countWithSearch(param);
    const dataList = await Model.search(param);
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

const create = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    newBody.id = uuidv4();
    newBody.isActive = true;
    newBody.updatedBy = newBody.createdBy;
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.create(newBody);
    if (insertData && insertData.length > 0) {
      result = { ...result, item: insertData[0] };
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
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(id);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.update(newBody, id);
      if (updateData) {
        newBody.id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been updated successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
        Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the id.`;
      logger.error(`Unable to update ${moduleName}. please check the id.`);
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to update ${moduleName}.
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

const find = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(id);
    if (findResult && Object.keys(findResult).length > 0) {
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName}. please check the id.`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const updateStatus = async (moduleName, id, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(id);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.updateStatus(newBody, id);
      if (updateData) {
        newBody.id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been status updated successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to status update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to status update ${moduleName}.
        Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to status update ${moduleName}. please check the id.`;
      logger.error(
        `Unable to status update ${moduleName}. please check the id.`
      );
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to status update ${moduleName}.
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

const del = async (moduleName, id, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(id);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updatedDate = new Date();
      newBody.isActive = false;
      newBody.isDeleted = true;
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.updateStatus(newBody, id);
      if (updateData) {
        newBody.id = findResult.id;
        result = { ...result, item: findResult };
        result.message = `${moduleName} has been deleted successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to delete ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to delete ${moduleName}.
        Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete ${moduleName}. please check the id.`;
      logger.error(`Unable to delete ${moduleName}. please check the id.`);
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to delete ${moduleName}.
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

const lovProvider = async (moduleName, tenant, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.lovProvider(tenant);
    if (findResult && findResult.length > 0) {
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been lov provider list successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.OK;
      result.message = `Unable to lov provider list ${moduleName}. no provider is available.`;
      logger.error(
        `Unable to lov provider list ${moduleName}. no provider is available.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(
      `Unable to lov provider list ${moduleName}. please check the id.
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
  search,
  create,
  update,
  find,
  updateStatus,
  del,
  lovProvider,
};
