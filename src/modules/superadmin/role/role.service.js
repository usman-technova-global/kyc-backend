const roleModel = require('./role.model');
const permissionModel = require('../permission/permission.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await roleModel.count();
    const roleList = await roleModel.list(param, logger);
    if (roleList) {
      result.items.list = roleList;
      result.items.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.`;
      logger.error(`Unable to fetch role list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list role list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const lov = async (moduleName, logger) => {
  const result = { hasError: false };
  try {
    const roleList = await roleModel.getRoles();
    if (roleList) {
      result.items = roleList;
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.`;
      logger.error(`Unable to fetch role list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list role list.
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
    const total = await roleModel.countWithSearch(param);
    const roleList = await roleModel.search(param, logger);
    if (roleList) {
      result.items.list = roleList.rows;
      result.items.total = parseInt(total.rows[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.`;
      logger.error(`Unable to fetch role list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list role list.
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
  let result = { hasError: false };
  try {
    const findResult = await roleModel.findByName(body.name);
    if (findResult && Object.keys(findResult).length > 0) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create because ${moduleName} name is already exist.`;
      logger.error(
        `Unable to create because ${moduleName} name is already exist.
        Payload:: ${prettyPrintJSON(body)}`
      );
      return result;
    }
    const createRole = await roleModel.create(body);
    if (createRole && Object.keys(createRole[0]).length > 0) {
      result = { ...result, item: createRole[0] };
      result.message = `${moduleName} has been created successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(body)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(body)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const permissions = async (moduleName, logger) => {
  const result = { hasError: false };
  try {
    const generateArr = [];
    const permissionList = await permissionModel.list();
    const newArr = permissionList.filter(
      (item) => item.permission_parent === null
    );
    newArr.forEach((item) => {
      const newFilter = permissionList.filter(
        (obj) => obj.permission_parent === item.id
      );
      const finalArr = newFilter.map((finalObj) => ({
        ...finalObj,
        status: false,
      }));
      if (finalArr) {
        generateArr.push({ name: item.name, data: finalArr });
      } else {
        generateArr.push({ name: item.name, data: [] });
      }
    });
    if (generateArr) {
      result.items = generateArr;
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.`;
      logger.error(`Unable to fetch role list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list role list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const get = async (moduleName, roleId, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await roleModel.findById(roleId);
    if (findResult && Object.keys(findResult).length > 0) {
      const findPermissions = await roleModel.findPermissionsById(
        findResult.id
      );
      if (findPermissions && Object.keys(findPermissions).length > 0) {
        const generateArr = [];
        const permissionList = await permissionModel.list();
        const newArr = permissionList.filter(
          (item) => item.permission_parent === null
        );
        newArr.forEach((item) => {
          const newFilter = permissionList.filter(
            (obj) => obj.permission_parent === item.id
          );
          const finalArr = newFilter.map((finalObj) => {
            const permissionResult = findPermissions.filter(
              (permissionItem) =>
                permissionItem.role_id === roleId &&
                permissionItem.permission_id === finalObj.id
            );
            if (permissionResult && permissionResult.length > 0) {
              return { ...finalObj, status: permissionResult[0].is_active };
            }
            return { ...finalObj, status: false };
          });
          if (finalArr) {
            generateArr.push({ name: item.name, data: finalArr });
          } else {
            generateArr.push({ name: item.name, data: [] });
          }
        });
        const data = {
          id: roleId,
          name: findResult.name,
          desc: findResult.desc,
          data: generateArr,
        };
        if (generateArr) {
          result.items = data;
          result.message = `${moduleName} list has been fetched successfully.`;
          result.code = HTTP_STATUS.OK;
        } else {
          result.hasError = true;
          result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          result.message = `Unable to fetch role list.`;
          logger.error(`Unable to fetch role list`);
        }
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to fetch role list.`;
        logger.error(`Unable to fetch role list`);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.`;
      logger.error(`Unable to fetch role list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list role list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const update = async (moduleName, roleId, body, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await roleModel.findByNameAndId(roleId, body.name);
    if (findResult && Object.keys(findResult).length > 0) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update because ${moduleName} name is already exist.`;
      logger.error(
        `Unable to update because ${moduleName} name is already exist.
        Payload:: ${prettyPrintJSON(body)}`
      );
      return result;
    }

    const findRole = await roleModel.findById(roleId);
    if (findRole && Object.keys(findRole).length > 0) {
      const updateRole = await roleModel.update(findRole.id, body);
      if (updateRole) {
        findRole.name = body.name;
        findRole.desc = body.desc;
        result = { ...result, item: findRole };
        result.message = `${moduleName} has been updated successfully.`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
          Payload:: ${prettyPrintJSON(body)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to update ${moduleName}.
          Payload:: ${prettyPrintJSON(body)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(body)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateStatus = async (moduleName, param, body, logger) => {
  const newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await roleModel.findById(param.id);
    if (findResult && Object.keys(findResult).length > 0) {
      const roleUpdateStatus = await roleModel.updateStatus(newBody, param.id);
      if (roleUpdateStatus) {
        newBody.id = findResult.id;
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
  lov,
  permissions,
  create,
  get,
  update,
  search,
  updateStatus,
};
