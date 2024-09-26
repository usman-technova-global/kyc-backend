const { v4: uuidv4 } = require('uuid');
const Model = require('./banner.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const uploader = require('../../../utils/s3Uploader/s3Uploader');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (moduleName, tenant, logger) => {
  const result = { hasError: false };
  try {
    const tempList = await Model.list(tenant);
    if (tempList) {
      result.items = tempList;
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

const createMultipart = async (moduleName, body, logger) => {
  let newBody = body;
  const file = newBody.banner;
  delete newBody.banner;
  let result = { hasError: false };
  try {
    if (file !== undefined) {
      const fileData = {
        Key: `app/images/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      newBody.banner = img.Location;
    }

    newBody.id = uuidv4();
    newBody.isActive = true;
    newBody.updatedBy = newBody.createdBy;
    if (!newBody.name) newBody.name = 'Banner';
    newBody = caseConversion.toSnakeCase(newBody);
    const createResult = await Model.createMultipart(newBody);
    if (createResult && createResult.rowCount > 0) {
      result = { ...result, item: newBody };
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

const find = async (moduleName, bannerId, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(bannerId);
    if (findResult && Object.keys(findResult).length > 0) {
      const tempData = findResult;
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} does not found.
        Id:: ${bannerId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${bannerId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateMultipart = async (moduleName, body, logger) => {
  let newBody = body;
  const file = newBody.banner;
  delete newBody.banner;
  let result = { hasError: false };
  try {
    const { bannerId } = newBody;
    delete newBody.bannerId;
    const findResult = await Model.findById(bannerId);
    if (findResult && Object.keys(findResult).length > 0) {
      if (file !== undefined) {
        const fileData = {
          Key: `app/images/${uuidv4()}-${file.filename}`,
          Body: file.buffer,
          'Content-Type': file.mimetype,
        };
        const img = await uploader.uploadToAdminBucket(fileData);
        newBody.banner = img.Location;
      } else {
        newBody.banner = findResult.banner;
      }

      newBody = caseConversion.toSnakeCase(newBody);
      newBody.updated_date = new Date();
      const updateResult = await Model.update(newBody, bannerId);
      if (updateResult) {
        newBody.id = bannerId;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been update successfully.`;
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
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the id.`;
      logger.error(
        `Unable to update ${moduleName}.
            id:: ${prettyPrintJSON(newBody)}`
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

const updateStatus = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const { bannerId } = newBody;
    delete newBody.bannerId;
    const findResult = await Model.findById(bannerId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await Model.update(newBody, bannerId);
      if (updateResult) {
        newBody.id = bannerId;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been status update successfully.`;
      } else {
        delete newBody.id;
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to status update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update status ${moduleName}.
            Payload:: ${prettyPrintJSON(newBody)}`
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
      `Unable to update status ${moduleName}.
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

const deleteBanner = async (moduleName, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const { bannerId } = newBody;
    delete newBody.bannerId;
    const findResult = await Model.findById(bannerId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.isDeleted = true;
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await Model.update(newBody, bannerId);
      if (updateResult) {
        newBody.id = bannerId;
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been delete successfully.`;
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

module.exports = {
  list,
  createMultipart,
  find,
  updateMultipart,
  updateStatus,
  deleteBanner,
};
