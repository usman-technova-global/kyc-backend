const { v4: uuidv4 } = require('uuid');
const Model = require('./appImage.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const uploader = require('../../../utils/s3Uploader/s3Uploader');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await Model.count();
    const tempList = await Model.list(param);
    if (tempList) {
      result.items.list = tempList;
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
    const dataList = await Model.search(param);
    if (dataList) {
      result.items.list = dataList.rows;
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

const createMultipart = async (moduleName, body, logger) => {
  let newBody = body;
  const file = newBody.avatar;
  delete newBody.avatar;
  let result = { hasError: false };
  try {
    if (file !== undefined) {
      const fileData = {
        Key: `app/images/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      newBody.avatar = img.Location;
    }

    newBody.id = uuidv4();
    newBody.isActive = true;
    newBody.updatedBy = newBody.createdBy;

    const newData = {
      id: uuidv4(),
      name: newBody.name,
      desc: newBody.desc,
      isActive: true,
      updatedBy: newBody.createdBy,
      createdBy: newBody.createdBy,
      avatar: newBody.avatar,
    };
    newBody = caseConversion.toSnakeCase(newData);
    const createResult = await Model.create(newBody);
    if (createResult && createResult.rowCount > 0) {
      delete newBody.is_active;
      newBody.isActive = true;
      newBody.isDeleted = false;
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

const edit = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(param.id);
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
        Id:: ${param.id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
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
  const file = newBody.avatar;
  delete newBody.avatar;
  let result = { hasError: false };
  try {
    const findResult = await Model.findById(param.id);
    if (findResult && Object.keys(findResult).length > 0) {
      if (file !== undefined) {
        const fileData = {
          Key: `app/images/${uuidv4()}-${file.filename}`,
          Body: file.buffer,
          'Content-Type': file.mimetype,
        };
        const img = await uploader.uploadToAdminBucket(fileData);
        newBody.avatar = img.Location;
      } else {
        newBody.avatar = findResult.avatar;
      }
      const newData = {
        name: newBody.name,
        desc: newBody.desc,
        updatedBy: newBody.updatedBy,
        avatar: newBody.avatar,
        isActive: findResult.is_active,
      };
      newBody = caseConversion.toSnakeCase(newData);
      const updateResult = await Model.update(newBody, param.id);
      if (updateResult) {
        newBody.id = param.id;
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

module.exports = { list, search, createMultipart, edit, updateMultipart };
