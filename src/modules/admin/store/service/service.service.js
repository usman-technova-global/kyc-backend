const { v4: uuidv4 } = require('uuid');
const Model = require('./service.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');

const categoryList = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findList = await Model.categoryList(uriParams);
    if (findList) {
      result.items.total = parseInt(findList.total, 10);
      result.items.list = findList.totalList;
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

const categoryCreate = async (moduleName, session, body, logger) => {
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

    newBody.isActive = true;
    newBody.tenant = uriParams.tenant;
    newBody.createdBy = uriParams.userId;
    newBody.updatedBy = uriParams.userId;
    newBody = caseConversion.toSnakeCase(newBody);

    const [createResult] = await Model.createCategory(newBody);
    if (createResult) {
      result = { ...result, item: createResult };
      result.message = `Category ${moduleName} has been created successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create category ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create category ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to create category ${moduleName}.
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

const categoryUpdate = async (moduleName, session, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
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

    newBody.updatedBy = uriParams.userId;
    newBody.updatedDate = new Date();
    newBody = caseConversion.toSnakeCase(newBody);

    const [updateResult] = await Model.updateCategory(newBody, uriParams);
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `Category ${moduleName} has been updated successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update category ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to update category ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to update category ${moduleName}.
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

const categoryUpdateStatus = async (
  moduleName,
  session,
  param,
  body,
  logger
) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);

    newBody.updatedBy = uriParams.userId;
    newBody.updatedDate = new Date();
    newBody = caseConversion.toSnakeCase(newBody);

    const [updateResult] = await Model.updateCategory(newBody, uriParams);
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `Category ${moduleName} has been status updated successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to status update category ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to status update category ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to status update category ${moduleName}.
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

const categoryDelete = async (moduleName, session, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);

    newBody.updatedBy = uriParams.userId;
    newBody.updatedDate = new Date();
    newBody = caseConversion.toSnakeCase(newBody);

    const [updateResult] = await Model.updateCategory(newBody, uriParams);
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `Category ${moduleName} has been deleted successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete category ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to delete category ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to delete category ${moduleName}.
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

const categoryItemList = async (moduleName, query, param, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findList = await Model.categoryItemList(uriParams);
    if (findList) {
      result.items.total = parseInt(findList.total, 10);
      result.items.list = findList.totalList;
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

const categoryItemCreate = async (moduleName, session, body, logger) => {
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

    newBody.isActive = true;
    newBody.createdBy = uriParams.userId;
    newBody.updatedBy = uriParams.userId;
    newBody = caseConversion.toSnakeCase(newBody);

    const [createResult] = await Model.createCategoryItem(newBody);
    if (createResult) {
      result = { ...result, item: createResult };
      result.message = `Category item ${moduleName} has been created successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create category item ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create category item ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to create category item ${moduleName}.
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

const categoryItemUpdate = async (moduleName, session, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
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

    newBody.updatedBy = uriParams.userId;
    newBody.updatedDate = new Date();
    newBody = caseConversion.toSnakeCase(newBody);

    const [updateResult] = await Model.updateCategoryItem(newBody, uriParams);
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `Category item ${moduleName} has been updated successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update category item ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to update category item ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to update category item ${moduleName}.
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

const categoryItemUpdateStatus = async (
  moduleName,
  session,
  param,
  body,
  logger
) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);

    newBody.updatedBy = uriParams.userId;
    newBody.updatedDate = new Date();
    newBody = caseConversion.toSnakeCase(newBody);

    const [updateResult] = await Model.updateCategoryItem(newBody, uriParams);
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `Category Item ${moduleName} has been status updated successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to status update category item ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to status update category item ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to status update category item ${moduleName}.
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

const categoryItemDelete = async (moduleName, session, param, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);

    newBody.updatedBy = uriParams.userId;
    newBody.updatedDate = new Date();
    newBody = caseConversion.toSnakeCase(newBody);

    const [updateResult] = await Model.updateCategoryItem(newBody, uriParams);
    if (updateResult) {
      result = { ...result, item: updateResult };
      result.message = `Category Item ${moduleName} has been deleted successfully.`;
    } else {
      delete newBody.id;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete category item ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to delete category item ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
    delete newBody.id;

    logger.error(
      `Unable to delete category item ${moduleName}.
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

const categoryLov = async (moduleName, session, logger) => {
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
    };
    uriParams = caseConversion.toCamelCase(uriParams);

    const findList = await Model.categoryLov(uriParams);
    if (findList.length) {
      result = { ...result, items: findList };
      result.message = `Store service category lov ${moduleName} has been ftched successfull.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `No store service category lov is available.`;
      logger.error(`No store service category lov is available. ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to find store service category lov ${moduleName}.
    Error:: ${error}
    Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const categoryItemLov = async (moduleName, session, param, logger) => {
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);

    const findList = await Model.categoryItemLov(uriParams);
    if (findList) {
      result = { ...result, items: findList };
      result.message = `Store service category item lov ${moduleName} has been ftched successfull.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `No store service category item lov is available.`;
      logger.error(
        `No store service category item lov is available. ${moduleName}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to find store service category item lov ${moduleName}.
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
  categoryList,
  categoryCreate,
  categoryUpdate,
  categoryUpdateStatus,
  categoryItemList,
  categoryItemCreate,
  categoryItemUpdate,
  categoryItemUpdateStatus,
  categoryLov,
  categoryItemLov,
  categoryDelete,
  categoryItemDelete,
};
