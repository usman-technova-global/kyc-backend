const { v4: uuidv4 } = require('uuid');
const Model = require('./system.model');
const caseConversion = require('../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../utils/constants/httpStatus');
const uploader = require('../../utils/s3Uploader/s3Uploader');

const get = async (moduleName, param, logger) => {
  let result = {
    hasError: false,
  };
  try {
    const fineResult = await Model.get(param.tenant);
    if (fineResult) {
      result.item = fineResult;
      result = { ...result };
      result.message = `${moduleName} has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName}.`;
      logger.error(`Unable to fetch ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const getDomain = async (moduleName, param, logger) => {
  let result = {
    hasError: false,
  };
  try {
    const fineResult = await Model.getSystemConfig(param.domain);
    if (fineResult) {
      result.item = fineResult;
      result = { ...result };
      result.message = `${moduleName} has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName}.`;
      logger.error(`Unable to fetch ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const defaultTheme = async (moduleName, logger) => {
  let result = {
    hasError: false,
  };
  try {
    const fineResult = await Model.defaultTheme();
    if (fineResult) {
      result.item = fineResult;
      result = { ...result };
      result.message = `${moduleName} has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName}.`;
      logger.error(`Unable to fetch ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const detail = async (moduleName, param, logger) => {
  let result = {
    hasError: false,
  };
  try {
    const fineResult = await Model.systemConfigDetail(param.tenant);
    if (fineResult) {
      result.item = fineResult;
      result = { ...result };
      result.message = `${moduleName} has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName}.`;
      logger.error(`Unable to fetch ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const colorChange = async (moduleName, param, body, logger) => {
  let newBody = body;
  let result = {
    hasError: false,
  };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const updateResult = await Model.colorChange(param.tenant, newBody);
    if (updateResult) {
      result.item = updateResult;
      result = { ...result };
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const layoutUpdate = async (moduleName, param, body, logger) => {
  let newBody = body;
  const file = newBody.logoffImage;
  delete newBody.logoffImage;
  let result = {
    hasError: false,
  };
  try {
    const getResult = await Model.findById(param.tenant);
    if (file) {
      const fileData = {
        Key: `app/images/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      newBody.logoffImage = img.Location;
    } else {
      newBody.logoffImage = getResult.logoff_image;
    }
    newBody = caseConversion.toSnakeCase(newBody);
    const updateResult = await Model.layoutUpdate(param.tenant, newBody);
    if (updateResult) {
      result.item = getResult;
      result = { ...result };
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = {
  get,
  getDomain,
  detail,
  colorChange,
  layoutUpdate,
  defaultTheme,
};
