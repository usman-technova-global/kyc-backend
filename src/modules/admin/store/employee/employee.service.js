const { v4: uuidv4 } = require('uuid');
const Model = require('./employee.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const { hashAsync } = require('../../../../utils/security/bcrypt');

const list = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.list(uriParams);
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

const employeeList = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.employeeListService(uriParams);
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

const create = async (moduleName, session, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const file = newBody.avatar;
    delete newBody.avatar;
    if (file !== undefined) {
      const fileData = {
        Key: `menu/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      if (img) {
        newBody.avatar = img.Location;
      } else {
        newBody.avatar = null;
      }
    }
    // newBody.avatar = null;
    newBody.password = await hashAsync(newBody.password);
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.create(uriParams, newBody);
    if (insertData && Object.keys(insertData).length > 0) {
      delete insertData.password;
      result = { ...result, item: insertData };
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

const find = async (moduleName, session, param, logger) => {
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.findStoreEmployeeById(uriParams);
    if (findResult && Object.keys(findResult).length > 0) {
      delete findResult.password;
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

const update = async (moduleName, uriParams, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(uriParams.employeeId);
    if (findResult) {
      delete findResult.password;
      const file = newBody.avatar;
      delete newBody.avatar;
      if (file !== undefined) {
        const fileData = {
          Key: `menu/${uuidv4()}-${file.filename}`,
          Body: file.buffer,
          'Content-Type': file.mimetype,
        };
        const img = await uploader.uploadToAdminBucket(fileData);
        if (img) {
          newBody.avatar = img.Location;
        } else {
          newBody.avatar = findResult.avatar;
        }
      }
      if (newBody.password)
        newBody.password = await hashAsync(newBody.password);

      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateData = await Model.update(uriParams, newBody);
      if (updateData && Object.keys(updateData).length > 0) {
        if (newBody.password) delete updateData.password;
        result = { ...result, item: updateData };
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
      result.message = `Unable found ${moduleName}. please check the id.`;
      logger.error(
        `Unable found ${moduleName}.
        id:: ${prettyPrintJSON(uriParams.employeeId)}`
      );
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

const updateStatus = async (moduleName, session, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.findById(uriParams.employeeId);
    if (findResult && Object.keys(findResult).length > 0) {
      delete findResult.password;
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const [updateData] = await Model.updateStatus(
        newBody,
        uriParams.employeeId
      );
      if (updateData) {
        newBody.id = updateData.id;
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

const employeeDelete = async (moduleName, session, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.findById(uriParams.employeeId);
    if (findResult && Object.keys(findResult).length > 0) {
      delete findResult.password;
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const [updateData] = await Model.updateStatus(
        newBody,
        uriParams.employeeId
      );
      if (updateData) {
        newBody.id = updateData.id;
        result = { ...result, item: newBody };
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

const employeeServiceList = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findEmployee = await Model.findById(uriParams.employeeId);
    if (!findEmployee) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    delete findEmployee.password;
    const findResult = await Model.storeEmployeeServiceList(
      uriParams.employeeId
    );

    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} services has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} service. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} service. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} service. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeServiceLov = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findEmployee = await Model.findById(uriParams.employeeId);
    if (!findEmployee) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    delete findEmployee.password;
    const findResult = await Model.employeeServiceLov(uriParams.employeeId);

    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} services has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} service. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} service. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} service. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeLov = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.employeeLov(uriParams);

    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} services has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} service. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} service. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} service. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeServiceCreate = async (moduleName, uriParams, body, logger) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findEmployee = await Model.findById(uriParams.employeeId);
    if (!findEmployee) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    delete findEmployee.password;
    newBody = caseConversion.toSnakeCase(newBody);
    const createResult = await Model.storeEmployeeServiceCreate(
      uriParams,
      newBody
    );
    if (createResult) {
      result = { ...result, items: createResult };
      result.message = `${moduleName} services has been create successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName} service. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName} service. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to create ${moduleName} service. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeServiceUpdate = async (moduleName, uriParams, body, logger) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findService = await Model.findServiceById(uriParams.serviceId);
    if (!findService) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const updateResult = await Model.storeEmployeeServiceUpdate(
      uriParams,
      newBody
    );
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `${moduleName} services has been updated successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName} service. please check the payload.`;
      logger.error(
        `Unable to update ${moduleName} service. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to update ${moduleName} service. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeServiceUpdateStatus = async (
  moduleName,
  uriParams,
  body,
  logger
) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findService = await Model.findServiceById(uriParams.serviceId);
    if (!findService) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    newBody.updatedBy = uriParams.userId;
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const [updateResult] = await Model.storeEmployeeServiceUpdateStatus(
      uriParams.serviceId,
      newBody
    );
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `${moduleName} services has been status updated successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to status update ${moduleName} service. please check the payload.`;
      logger.error(
        `Unable to status update ${moduleName} service. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to status update ${moduleName} service. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeServiceDelete = async (moduleName, uriParams, body, logger) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findService = await Model.findServiceById(uriParams.serviceId);
    if (!findService) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    newBody.isActive = false;
    newBody.isDeleted = true;
    newBody.updatedBy = uriParams.userId;
    newBody = caseConversion.toSnakeCase(newBody);
    const [updateResult] = await Model.storeEmployeeServiceUpdateStatus(
      uriParams.serviceId,
      newBody
    );
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `${moduleName} services has been deleted successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete ${moduleName} service. please check the payload.`;
      logger.error(
        `Unable to delete ${moduleName} service. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to delete ${moduleName} service. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeScheduleList = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findEmployee = await Model.findById(uriParams.employeeId);
    if (!findEmployee) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    delete findEmployee.password;
    const findResult = await Model.storeEmployeeScheduleList(
      uriParams.employeeId
    );
    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} schedule has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} schedule. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} schedule. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} schedule. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeScheduleCreate = async (moduleName, uriParams, body, logger) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findEmployee = await Model.findById(uriParams.employeeId);
    if (!findEmployee) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
      return caseConversion.toCamelCase(result);
    }
    delete findEmployee.password;
    newBody = caseConversion.toSnakeCase(newBody);
    const createResult = await Model.storeEmployeeScheduleCreate(
      uriParams,
      newBody
    );
    if (createResult) {
      result = { ...result, items: createResult };
      result.message = `${moduleName} schedule has been create successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName} schedule. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName} schedule. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to create ${moduleName} schedule. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeScheduleUpdate = async (moduleName, uriParams, body, logger) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findSchedule = await Model.findScheduleById(uriParams.scheduleId);
    if (!findSchedule) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
      return caseConversion.toCamelCase(result);
    }
    newBody.updatedBy = uriParams.userId;
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const [updateResult] = await Model.storeEmployeeScheduleUpdate(
      uriParams,
      newBody
    );
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `${moduleName} schedule has been updated successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName} schedule. please check the payload.`;
      logger.error(
        `Unable to update ${moduleName} schedule. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to update ${moduleName} schedule. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const employeeScheduleUpdateStatus = async (
  moduleName,
  uriParams,
  body,
  logger
) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const findSchedule = await Model.findScheduleById(uriParams.scheduleId);
    if (!findSchedule) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    newBody.updatedBy = uriParams.userId;
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const [updateResult] = await Model.storeEmployeeScheduleStatusUpdate(
      uriParams.scheduleId,
      newBody
    );
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `${moduleName} schedule has been status updated successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to status update ${moduleName} schedule. please check the payload.`;
      logger.error(
        `Unable to status update ${moduleName} schedule. please check the payload.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to status update ${moduleName} schedule. please check the payload.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const attendanceList = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findEmployee = await Model.findById(uriParams.employeeId);
    if (!findEmployee) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName}. please check the id.`;
      logger.error(`Unable to find ${moduleName}. please check the id.`);
    }
    delete findEmployee.password;
    const findResult = await Model.attendanceList(uriParams);
    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} attendance has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} attendance. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} attendance. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} attendance. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const leave = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.leave(uriParams);
    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} leave has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} leave. please check the id.`;
      logger.error(`Unable to find ${moduleName} leave. please check the id.`);
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} leave. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const leaveManagement = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.leaveManagement(uriParams);
    result = { ...result, item: findResult };
    result.message = `Day available for appointment.`;
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} leave. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const detail = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.detail(uriParams);
    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} detail has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} detail. please check the id.`;
      logger.error(`Unable to find ${moduleName} detail. please check the id.`);
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} detail. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const reviews = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.reviews(uriParams);
    if (findResult) {
      delete findResult.password;
      result = {
        ...result,
        items: { list: findResult.totalList, total: findResult.total },
      };
      result.message = `${moduleName} reviews has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} reviews. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} reviews. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} reviews. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const distinctStarList = async (moduleName, uriParams, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.distinctStarList(uriParams);
    if (findResult) {
      delete findResult.password;
      result = { ...result, items: findResult };
      result.message = `${moduleName} star list has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} star list. please check the id.`;
      logger.error(
        `Unable to find ${moduleName} star list. please check the id.`
      );
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} star list. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const leaveManagementUpdateStatus = async (
  moduleName,
  uriParams,
  body,
  logger
) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const findResult = await Model.leaveManagementUpdateStatus(
      uriParams,
      newBody
    );
    result = { ...result, item: findResult };
    result.message = `Day available for appointment.`;
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} leave. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const expenseList = async (moduleName, uriParams, logger) => {
  let result = {
    hasError: false,
    items: { list: [], total: 0, identifierData: null },
  };
  try {
    const findResult = await Model.expenseList(uriParams);
    if (findResult) {
      result.items.total = findResult.total;
      result.items.list = findResult.totalList;
      result = { ...result };
      result.message = `${moduleName} list has been find successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find ${moduleName} list. please check the id.`;
      logger.error(`Unable to find ${moduleName} list. please check the id.`);
    }
  } catch (error) {
    // delete body.id;
    logger.error(`Unable to find ${moduleName} list. please check the id.
    Error:: ${error}
    Trace:: ${error.stack}`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const expenseCreate = async (moduleName, uriParams, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.expenseCreate(uriParams, newBody);
    if (insertData && insertData.length > 0) {
      result = { ...result, items: insertData };
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

module.exports = {
  list,
  create,
  update,
  find,
  updateStatus,
  employeeDelete,
  employeeServiceList,
  employeeServiceCreate,
  employeeServiceUpdate,
  employeeServiceUpdateStatus,
  employeeServiceDelete,
  employeeScheduleList,
  employeeScheduleCreate,
  employeeScheduleUpdate,
  employeeScheduleUpdateStatus,
  attendanceList,
  leave,
  detail,
  reviews,
  distinctStarList,
  leaveManagement,
  leaveManagementUpdateStatus,
  employeeList,
  employeeServiceLov,
  expenseList,
  expenseCreate,
  employeeLov,
};
