const { v4: uuidv4 } = require('uuid');
const permissionModel = require('./permission.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (logger) => {
  let permissionList = { hasError: false };
  try {
    const tempPermissionList = await permissionModel.list();
    if (tempPermissionList) {
      const users = tempPermissionList.map((user) =>
        caseConversion.toCamelCase(user)
      );
      permissionList = { ...permissionList, users };
      permissionList.message = `Permission list has been fetched successfully.`;
      permissionList.code = HTTP_STATUS.OK;
    } else {
      permissionList.hasError = true;
      permissionList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      permissionList.message = `Unable to fetch list permission list.`;
      logger.error(`Permission does not found.`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list permission list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    permissionList.hasError = true;
    permissionList.message = error.detail;
    permissionList.code = error.code;
  }
  return caseConversion.toCamelCase(permissionList);
};

const findById = async (id, logger) => {
  let users = { hasError: false };
  try {
    const tempUsers = await permissionModel.findById(id);
    if (tempUsers && tempUsers.length > 0) {
      const user = tempUsers[0];
      users = { ...users, user };
      users.message = `Permission has been fetched successfully.`;
    } else {
      users.hasError = true;
      users.code = HTTP_STATUS.NOT_FOUND;
      users.message = `Permission does not found, please check the id.`;
      logger.error(
        `Permission does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `Error in creating permission.
      Error:: ${error}
      Trace:: ${error.stack}
      Id:: ${id}`
    );
    users.hasError = true;
    users.message = error.detail;
    users.code = error.code;
  }
  return caseConversion.toCamelCase(users);
};
const create = async (data, logger) => {
  let newData = data;
  let user = { hasError: false };
  try {
    newData.id = uuidv4();
    newData.updatedBy = newData.createdBy;
    newData = caseConversion.toSnakecase(newData);
    const tempUser = await permissionModel.create(newData);
    user = { ...tempUser, user };
    if (tempUser && tempUser.rowCount > 0) {
      user.message = `Permission has been created successfully`;
    }
  } catch (error) {
    logger.error(
      `Error in creating permission.
      Error:: ${error}
      Trace:: ${error.stack}
      Data:: ${prettyPrintJSON(newData)}`
    );
    user.hasError = true;
    user.message = error.detail;
    user.code = error.code;
  }
  return caseConversion.toCamelCase(user);
};

const paginationList = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await permissionModel.count();
    const permissionList = await permissionModel.paginationList(param, logger);
    if (permissionList) {
      result.items.list = permissionList;
      result.items.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch permission list.`;
      logger.error(`Unable to fetch permission list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list permission list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const paginationSearch = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await permissionModel.countWithSearch(param);
    const permissionList = await permissionModel.search(param, logger);
    if (permissionList) {
      result.items.list = permissionList.rows;
      result.items.total = parseInt(total.rows[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch permission list.`;
      logger.error(`Unable to fetch permission list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list permission list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const update = async (moduleName, id, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await permissionModel.findById(id);
    if (findResult && Object.keys(findResult[0]).length > 0) {
      newBody = caseConversion.toSnakeCase(newBody);
      const updateStatus = await permissionModel.update(newBody, id);
      if (updateStatus) {
        newBody.id = findResult[0].id;
        result = { ...result, item: { id: findResult[0].id } };
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
      result.message = `Unable to update ${moduleName}. please check the id.`;
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

const createTransaction = async (moduleName, body, logger) => {
  let newBody = body;
  const result = { hasError: false };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const createPermission = await permissionModel.createTransaction(newBody);
    if (createPermission && Object.keys(createPermission[0]).length > 0) {
      result.message = `${moduleName} has been created successfully`;
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
      `Error in creating ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Data:: ${prettyPrintJSON(newBody)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateTransaction = async (moduleName, id, body, logger) => {
  let newBody = body;
  const result = { hasError: false };
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const updateResult = await permissionModel.updateTransaction(newBody, id);
    if (updateResult) {
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

const getPermission = async (id, logger) => {
  let result = { hasError: false };
  try {
    const permission = await permissionModel.getPermission(id);
    if (permission && Object.keys(permission).length > 0) {
      result = { ...result, item: permission };
      result.message = `Permission has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Permission does not found, please check the id.`;
      logger.error(
        `Permission does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `Error in creating permission.
      Error:: ${error}
      Trace:: ${error.stack}
      Id:: ${id}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateStatus = async (moduleName, id, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await permissionModel.findById(id);
    if (findResult && Object.keys(findResult[0]).length > 0) {
      newBody = caseConversion.toSnakeCase(newBody);
      const updatedStatus = await permissionModel.updateStatus(newBody, id);
      if (updatedStatus) {
        newBody.id = findResult[0].id;
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
      result.message = `Unable to update ${moduleName}. please check the id.`;
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

const childList = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await permissionModel.childCount(param);
    const findList = await permissionModel.childList(param);
    if (findList) {
      result.items.list = findList;
      result.items.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch permission list.`;
      logger.error(`Unable to fetch permission list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list permission list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const childSearch = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await permissionModel.childCountWithSearch(param);
    const findList = await permissionModel.childSearch(param);
    if (findList) {
      result.items.list = findList.rows;
      result.items.total = parseInt(total.rows[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch permission list.`;
      logger.error(`Unable to fetch permission list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list permission list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const childUpdateStatus = async (moduleName, id, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await permissionModel.findById(id);
    if (findResult && Object.keys(findResult[0]).length > 0) {
      newBody = caseConversion.toSnakeCase(newBody);
      const updatedStatus = await permissionModel.childUpdateStatus(
        newBody,
        id
      );
      if (updatedStatus) {
        newBody.id = findResult[0].id;
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
      result.message = `Unable to update ${moduleName}. please check the id.`;
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
  findById,
  create,
  paginationList,
  paginationSearch,
  update,
  createTransaction,
  updateTransaction,
  getPermission,
  updateStatus,
  childList,
  childSearch,
  childUpdateStatus,
};
