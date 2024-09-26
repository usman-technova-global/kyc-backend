const { v4: uuidv4 } = require('uuid');
const Model = require('./visit.model');
const providerModel = require('../provider/provider.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  APPOINTMENT_STATUS,
} = require('../../../../utils/constants/enumConstants');

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
    newBody.status = APPOINTMENT_STATUS.NEW;
    // body.appointmentService = JSON.stringify(body.appointmentService);
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.create(newBody);
    if (!insertData.hasError && Object.keys(insertData.item).length > 0) {
      result = { ...result, item: insertData.item };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = insertData.message;
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

const find = async (moduleName, appointmentId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(appointmentId);
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
    logger.error(`Unable to find ${moduleName}. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);

    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const reSchedule = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const { appointmentId } = newBody;
    delete newBody.appointmentId;
    newBody.id = uuidv4();
    newBody.status = APPOINTMENT_STATUS.NEW;
    // body.appointmentService = JSON.stringify(body.appointmentService);
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.reSchedule(newBody, appointmentId);
    if (!insertData.hasError && Object.keys(insertData.item).length > 0) {
      result = { ...result, item: insertData.item };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = insertData.message;
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

const lovProvider = async (moduleName, tenant, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.lovProvider(tenant);
    if (findResult && findResult.length > 0) {
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been lov provider list successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to lov provider list ${moduleName}. please check the id.`;
      logger.error(
        `Unable to lov provider list ${moduleName}. please check the id.`
      );
    }
  } catch (error) {
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

const lovService = async (moduleName, providerId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.lovService(providerId);
    if (findResult && findResult.length > 0) {
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been lov service list successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to lov service list ${moduleName}. please check the id.`;
      logger.error(
        `Unable to lov service list ${moduleName}. please check the id.`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to lov service list ${moduleName}. please check the id.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const edit = async (moduleName, appointmentId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(appointmentId);
    if (findResult && Object.keys(findResult).length > 0) {
      const lovProviderResult = await Model.lovProvider(findResult.tenant);
      const lovServiceResult = await Model.lovService(
        findResult.appointment_provider
      );
      findResult.providers = lovProviderResult;
      findResult.services = lovServiceResult;
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
  } catch (error) {
    logger.error(`Unable to find ${moduleName}. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const provider = async (moduleName, providerId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await providerModel.providerDetailById(providerId);
    if (findResult && Object.keys(findResult).length > 0) {
      result = { ...result, item: findResult[0] };
      result.message = `${moduleName} has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
  } catch (error) {
    logger.error(`Unable to find ${moduleName}. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const update = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const { appointmentId } = newBody;
    delete newBody.appointmentId;
    const findResult = await Model.findById(appointmentId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.appointmentService = JSON.stringify(newBody.appointmentService);
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.update(newBody, findResult, appointmentId);
      if (updateData) {
        newBody.appointment_id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been updated successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = updateData.message;
        logger.error(
          `Unable to update ${moduleName}.
        Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
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

const cancel = async (moduleName, appointmentId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(appointmentId);
    if (findResult && Object.keys(findResult).length > 0) {
      let body = {};
      body.status = APPOINTMENT_STATUS.CANCELLED;
      body = caseConversion.toSnakeCase(body);
      const updateStatus = await Model.update(body, findResult, appointmentId);
      if (updateStatus) {
        body.appointment_id = findResult.id;
        result = { ...result, item: body };
        result.message = `${moduleName} has been find successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}. please check the id.`;
        logger.error(`Unable to update ${moduleName}. please check the id.`);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
  } catch (error) {
    logger.error(`Unable to cancel ${moduleName}. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const detail = async (moduleName, appointmentId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.detail(appointmentId);
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
    logger.error(`Unable to find ${moduleName}. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
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
  find,
  reSchedule,
  lovProvider,
  lovService,
  edit,
  provider,
  update,
  cancel,
  detail,
};
