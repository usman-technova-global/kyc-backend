const { v4: uuidv4 } = require('uuid');
const settingModel = require('./setting.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const get = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await settingModel.findByTenant(param.tenant);
    if (getResult) {
      result = { ...result, item: getResult };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} does not found.
        Id:: ${param.tenantConfigId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${param.tenantConfigId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateMultipart = async (moduleName, param, body, logger) => {
  let newBody = body;
  const file = newBody.logo;
  delete newBody.logo;
  let result = { hasError: false };
  try {
    const getResult = await settingModel.findById(param.tenant);
    if (file) {
      const fileData = {
        Key: `menu/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      newBody.logo = img.Location;
    } else {
      newBody.logo = getResult.logo;
    }
    newBody = caseConversion.toSnakeCase(newBody);
    const newData = await settingModel.update(param.tenant, newBody);
    if (newData) {
      const findResult = await settingModel.findByTenant(param.tenant);
      result = { ...result, item: findResult };
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

const getAddress = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await settingModel.findAddressByTenant(param.tenant);
    if (getResult) {
      result = { ...result, item: getResult };
      result.message = `Address has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Address does not found, please check the id.`;
      logger.error(
        `Address does not found.
        Id:: ${param.tenant}`
      );
    }
  } catch (error) {
    logger.error(
      `Address does not found.
      Id:: ${param.tenant}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateMedia = async (moduleName, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const getResult = await settingModel.findById(param.tenant);
    if (getResult && getResult !== null) {
      newBody = caseConversion.toSnakeCase(newBody);
      const newData = await settingModel.updateMedia(getResult.id, newBody);
      if (newData) {
        newBody.id = getResult.id;
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

module.exports = { get, updateMultipart, getAddress, updateMedia };
