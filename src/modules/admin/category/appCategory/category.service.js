const { v4: uuidv4 } = require('uuid');
const categoryModel = require('./category.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await categoryModel.count(param);
    const dataList = await categoryModel.list(param);
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
    const total = await categoryModel.countWithSearch(param);
    const dataList = await categoryModel.search(param);
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
  const newBody = body;
  let result = { hasError: false };
  try {
    const file = newBody.icon;
    delete newBody.icon;
    const fileData = {
      Key: `menu/${uuidv4()}-${file.filename}`,
      Body: file.buffer,
      'Content-Type': file.mimetype,
    };
    const img = await uploader.uploadToAdminBucket(fileData);
    if (img) {
      newBody.icon = img.Location;
      newBody.banner = img.Location;
    } else {
      newBody.icon = null;
      newBody.banner = null;
    }

    newBody.id = uuidv4();
    newBody.is_active = true;
    const categoryResult = await categoryModel.create(newBody);
    if (categoryResult && categoryResult.rowCount > 0) {
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

const findById = async (moduleName, param, logger) => {
  let result = { hasError: false };
  try {
    const categoryData = await categoryModel.findById(param.categoryId);
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
      Id:: ${param.categoryId}
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
  const newBody = body;
  const file = newBody.icon;
  delete newBody.icon;
  let result = { hasError: false };
  try {
    const category = await categoryModel.findById(param.categoryId);
    if (category && category.length > 0) {
      if (file !== undefined) {
        const fileData = {
          Key: `menu/${uuidv4()}-${file.filename}`,
          Body: file.buffer,
          'Content-Type': file.mimetype,
        };
        const img = await uploader.uploadToAdminBucket(fileData);
        newBody.icon = img.Location;
      }
      const categoryResult = await categoryModel.update(
        newBody,
        param.categoryId
      );
      if (categoryResult) {
        newBody.id = param.categoryId;
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
      result.message = `Unable to update ${moduleName}. please check the category id.`;
      logger.error(
        `Unable to update ${moduleName}.
            category id:: ${prettyPrintJSON(newBody)}`
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

const update = async (moduleName, param, body, logger) => {
  let result = { hasError: false };
  let newBody = body;
  try {
    const category = await categoryModel.findById(param.categoryId);
    if (category && category.length > 0) {
      newBody = caseConversion.toSnakeCase(newBody);
      const categoryResult = await categoryModel.update(
        newBody,
        param.categoryId
      );
      if (categoryResult) {
        result = { ...result, item: newBody };
        result.message = `${moduleName} has been updated successfully.`;
      } else {
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
      result.message = `Unable to update ${moduleName}. please check the category id.`;
      logger.error(
        `Unable to update ${moduleName}.
        Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
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

module.exports = { list, search, create, updateMultipart, update, findById };
