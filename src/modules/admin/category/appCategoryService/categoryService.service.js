const { v4: uuidv4 } = require('uuid');
const categoryServiceModel = require('./categoryService.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await categoryServiceModel.count(param);
    const dataList = await categoryServiceModel.list(param);
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
    const total = await categoryServiceModel.countWithSearch(param);
    const dataList = await categoryServiceModel.search(param);
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
  let newBody = body;
  const file = newBody.icon;
  delete newBody.icon;
  let result = { hasError: false };
  try {
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
    newBody.homeCategory = param.categoryId;
    newBody.isActive = true;
    newBody.updatedBy = newBody.createdBy;
    newBody = caseConversion.toSnakeCase(newBody);
    const categoryServiceResult = await categoryServiceModel.create(newBody);
    if (categoryServiceResult && categoryServiceResult.rowCount > 0) {
      newBody.is_deleted = false;
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
    const categoryServiceData = await categoryServiceModel.findById(
      param.categoryServiceId
    );
    if (categoryServiceData && categoryServiceData.length > 0) {
      const tempData = categoryServiceData[0];
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        categoryId:: ${param.categoryServiceId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${param.categoryServiceId}
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
  const file = newBody.icon;
  delete newBody.icon;
  let result = { hasError: false };
  try {
    const categoryService = await categoryServiceModel.findById(
      param.categoryServiceId
    );
    if (categoryService && categoryService.length > 0) {
      if (file !== undefined) {
        const fileData = {
          Key: `menu/${uuidv4()}-${file.filename}`,
          Body: file.buffer,
          'Content-Type': file.mimetype,
        };
        const img = await uploader.uploadToAdminBucket(fileData);
        newBody.icon = img.Location;
      }
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const categoryServiceResult = await categoryServiceModel.update(
        newBody,
        param.categoryServiceId
      );
      if (categoryServiceResult) {
        newBody.id = param.categoryServiceId;
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
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the category service id.`;
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

const updateStatus = async (moduleName, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const categoryService = await categoryServiceModel.findById(
      param.categoryServiceId
    );
    if (categoryService && categoryService.length > 0) {
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const newResult = await categoryServiceModel.update(
        newBody,
        param.categoryServiceId
      );
      if (newResult) {
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
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the category service id.`;
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

const deleteCatService = async (moduleName, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const categoryService = await categoryServiceModel.findById(
      param.categoryServiceId
    );
    if (categoryService && categoryService.length > 0) {
      newBody.isActive = false;
      newBody.isDeleted = true;
      newBody.updatedDate = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const newResult = await categoryServiceModel.update(
        newBody,
        param.categoryServiceId
      );
      if (newResult) {
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
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the category service id.`;
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

module.exports = {
  list,
  search,
  create,
  updateStatus,
  updateMultipart,
  findById,
  deleteCatService,
};
