const { v4: uuidv4 } = require('uuid');
const Model = require('./appUser.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
// const uploader = require('../../../utils/s3Uploader/s3Uploader');
const { hashAsync } = require('../../../utils/security/bcrypt');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');

const login = async (moduleName, body, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.login(body);
    if (findResult && Object.keys(findResult).length > 0) {
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the identifier.`;
      logger.error(
        `${moduleName} user does not found.
        identifier:: ${body.identifier}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      identifier:: ${body.identifier}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const anonymousLogin = async (moduleName, body, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.anonymousLogin(body.identifier);
    if (findResult && Object.keys(findResult).length > 0) {
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the identifier.`;
      logger.error(
        `${moduleName} user does not found.
        identifier:: ${body.identifier}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      identifier:: ${body.identifier}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await Model.count(param);
    const dataList = await Model.list(param);
    if (dataList) {
      result.items.list = dataList;
      result.items.total = parseInt(total[0].count, 10);
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
    const dataList = await Model.search(param, logger);
    if (dataList) {
      result.items.list = dataList;
      result.items.total = parseInt(total.rows[0].count, 10);
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

const create = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const generatePassword = await hashAsync(newBody.password);
    if (generatePassword) {
      newBody.id = uuidv4();
      newBody.is_active = true;
      newBody.password = generatePassword;
      newBody = caseConversion.toSnakeCase(newBody);
      const createRow = await Model.create(newBody);
      if (createRow && Object.keys(createRow).length > 0) {
        delete createRow.password;
        result = { ...result, item: createRow };
        result.message = `${moduleName} has been created successfully.`;
      } else {
        delete newBody.id;
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to create ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to create ${moduleName}.
            Payload:: ${prettyPrintJSON(newBody)}`
        );
      }
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Password was not generated.`;
      logger.error(
        `Password was not generated..
          Payload:: ${prettyPrintJSON(newBody)}`
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

const find = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.find(param.userId);
    if (findResult && Object.keys(findResult).length > 0) {
      delete findResult.password;
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        driverId:: ${param.userId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${param.userId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
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
    const userId = newBody.id;
    delete newBody.id;
    const findResult = await Model.findById(userId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.update(userId, newBody);
      if (updateData) {
        newBody.id = userId;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been updated successfully.`;
      } else {
        delete newBody.id;
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
            Payload:: ${prettyPrintJSON(newBody)}`
        );
      }
    } else {
      delete newBody.id;
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

const updateStatus = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const userId = newBody.id;
    delete newBody.id;
    const findResult = await Model.findById(userId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.updateStatus(userId, newBody);
      if (updateData) {
        newBody.id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been updated successfully.`;
      } else {
        delete newBody.id;
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
            Payload:: ${prettyPrintJSON(newBody)}`
        );
      }
    } else {
      delete newBody.id;
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

const deleteUser = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const userId = newBody.id;
    delete newBody.id;
    const findResult = await Model.findById(userId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.isActive = false;
      newBody.isDeleted = true;
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.updateStatus(userId, newBody);
      if (updateData) {
        newBody.id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been deleted successfully.`;
      } else {
        delete newBody.id;
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to delete ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to delete ${moduleName}.
            Payload:: ${prettyPrintJSON(newBody)}`
        );
      }
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
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

const detail = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.detail(param.userId);
    if (findResult && Object.keys(findResult).length > 0) {
      delete findResult.password;
      result = { ...result, item: findResult };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        driverId:: ${param.userId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${param.userId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const addressCreate = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    newBody.id = uuidv4();
    newBody.is_active = true;
    newBody = caseConversion.toSnakeCase(newBody);
    const createRow = await Model.addressCreate(newBody);
    if (createRow && Object.keys(createRow).length > 0) {
      result = { ...result, item: createRow };
      result.message = `${moduleName} address has been created successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName} address. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName} address.
            Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to create ${moduleName} address.
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

const addressFind = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.addressFind(param.addressId);
    if (findResult && Object.keys(findResult).length > 0) {
      delete findResult.password;
      result = { ...result, item: findResult };
      result.message = `${moduleName} address has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} address does not found, please check the id.`;
      logger.error(
        `${moduleName} address user does not found.
        driverId:: ${param.userId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} address does not found.
      Id:: ${param.userId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const addressUpdate = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const updateData = await Model.addressUpdate(newBody);
    if (updateData && Object.keys(updateData).length > 0) {
      result = { ...result, item: updateData };
      result.message = `${moduleName} address has been updated successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName} address. please check the payload.`;
      logger.error(
        `Unable to update ${moduleName} address.
            Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to update ${moduleName} address.
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

const addressUpdateStatus = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const addressId = newBody.id;
    delete newBody.id;
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const updateData = await Model.addressUpdateStatus(addressId, newBody);
    if (updateData) {
      newBody.id = updateData.id;
      result = { ...result, item: newBody };
      result.message = `${moduleName} address has been updated successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName} address. please check the payload.`;
      logger.error(
        `Unable to update ${moduleName} address.
            Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to update ${moduleName} address.
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

const scheduleCreate = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.scheduleCreate(newBody);
    if (insertData && Object.keys(insertData).length > 0) {
      result = { ...result, item: insertData };
      result.message = `${moduleName} schedule has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName} schedule. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName} schedule.
      Payload:: ${prettyPrintJSON(result)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to create ${moduleName} schedule.
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

const scheduleFind = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.scheduleFind(param.scheduleId);
    if (findResult) {
      result.items = findResult;
      result = { ...result };
      result.message = `${moduleName} schedule has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} schedule. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} schedule. please check the id:: ${param.scheduleId}.`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to fetch find ${moduleName} schedule. Please check the id::: ${param.scheduleId}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const scheduleUpdate = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const scheduleId = newBody.id;
    delete newBody.id;
    const findResult = await Model.scheduleFind(scheduleId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await Model.scheduleUpdate(newBody, scheduleId);
      if (updateResult) {
        newBody.id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} schedule has been updated successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName} schedule. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
      Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} schedule. Please check the id::: ${scheduleId}`;
      logger.error(
        `Unable to find ${moduleName} schedule. Please check the id::: ${scheduleId}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to update ${moduleName} schedule.
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

const scheduleUpdateStatus = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const scheduleId = newBody.id;
    delete newBody.id;
    const findResult = await Model.scheduleFind(scheduleId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await Model.scheduleUpdate(newBody, scheduleId);
      if (updateResult) {
        newBody.id = findResult.id;
        result = { ...result, item: newBody };
        result.message = `${moduleName} schedule has been updated successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName} schedule. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName} schedule.
      Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} schedule. Please check the id::: ${scheduleId}`;
      logger.error(
        `Unable to find ${moduleName} schedule. Please check the id::: ${scheduleId}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to update ${moduleName} schedule.
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

const voucherHistoryList = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const findResult = await Model.voucherHistoryList(param);
    if (findResult) {
      result.items.list = findResult.totalList;
      result.items.total = parseInt(findResult.total, 10);
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history list.`;
      logger.error(`Unable to fetch voucher history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const voucherHistorySearch = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const searchResult = await Model.voucherHistorySearch(param);
    if (searchResult) {
      result.items.list = searchResult.totalList;
      result.items.total = parseInt(searchResult.total, 10);
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history list.`;
      logger.error(`Unable to fetch voucher history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const voucherHistoryDetail = async (param, logger) => {
  const result = { hasError: false };
  try {
    const historyDetail = await Model.voucherHistoryDetail(param);
    if (historyDetail) {
      result.item = historyDetail;
      result.message = `${MODULE.ADMIN.VOUCHER} detail has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history detail`;
      logger.error(`Unable to fetch voucher history detail`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history detail.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const loyaltyHistoryList = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const findResult = await Model.loyaltyHistoryList(param);
    if (findResult) {
      result.items.list = findResult.totalList;
      result.items.total = parseInt(findResult.total, 10);
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history list.`;
      logger.error(`Unable to fetch voucher history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const loyaltyHistorySearch = async (param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const searchResult = await Model.loyaltyHistorySearch(param);
    if (searchResult) {
      result.items.list = searchResult.totalList;
      result.items.total = parseInt(searchResult.total, 10);
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history list.`;
      logger.error(`Unable to fetch voucher history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const loyaltyHistoryDetail = async (param, logger) => {
  const result = { hasError: false };
  try {
    const historyDetail = await Model.loyaltyHistoryDetail(param);
    if (historyDetail) {
      result.item = historyDetail;
      result.message = `${MODULE.ADMIN.VOUCHER} detail has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history detail`;
      logger.error(`Unable to fetch voucher history detail`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history detail.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const driverList = async (uriParams, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const searchResult = await Model.driverList(uriParams);
    if (searchResult) {
      result.items.list = searchResult.totalList;
      result.items.total = parseInt(searchResult.total, 10);
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history list.`;
      logger.error(`Unable to fetch voucher history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const driverDetail = async (uriParams, logger) => {
  const result = { hasError: false };
  try {
    const searchResult = await Model.driverDetail(uriParams);
    if (searchResult) {
      result.item = searchResult;
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch wallet history list.`;
      logger.error(`Unable to fetch wallet history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch wallet history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const driverWalletDetail = async (uriParams, logger) => {
  const result = { hasError: false };
  try {
    const searchResult = await Model.driverWalletDetail(uriParams);
    if (searchResult) {
      result.item = searchResult;
      result.message = `${MODULE.ADMIN.VOUCHER} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch voucher history list.`;
      logger.error(`Unable to fetch voucher history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch voucher history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const lov = async (moduleName, query, logger) => {
  let result = { hasError: false, items: { list: [] } };
  try {
    let uriParams = {
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.lov(uriParams);
    // console.log('🚀 ~ lov ~ findResult:', findResult);
    if (findResult) {
      // result.items.total = parseInt(findResult.total, 10);
      result.items.list = findResult.totalList;
      result = { ...result };
      result.message = `${moduleName} list lov has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list lov.
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
  login,
  list,
  search,
  detail,
  create,
  find,
  update,
  updateStatus,
  deleteUser,
  addressCreate,
  addressFind,
  addressUpdate,
  addressUpdateStatus,
  scheduleCreate,
  scheduleFind,
  scheduleUpdate,
  scheduleUpdateStatus,
  anonymousLogin,
  voucherHistoryList,
  voucherHistorySearch,
  voucherHistoryDetail,
  loyaltyHistoryList,
  loyaltyHistorySearch,
  loyaltyHistoryDetail,
  driverList,
  driverDetail,
  driverWalletDetail,
  lov,
};
