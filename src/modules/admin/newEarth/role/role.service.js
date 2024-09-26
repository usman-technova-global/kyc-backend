const roleModel = require('./role.model');
const permissionModel = require('../permission/permission.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const { findUserById } = require('../../backofficeUser/backofficeUser.model');

const list = async (moduleName, param, logger) => {

  console.log("param------------------  ",param)
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await roleModel.count(param.tenant);
    let roleList = null;
    if(param.isSuperAdmin){
      roleList = await roleModel.listForSuperAdmin(param, logger);
      console.log("roleList ---- ", roleList)
    }else{
      roleList = await roleModel.list(param, logger);
    }

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

const lov = async (moduleName, logger, data) => {
  const result = { hasError: false };
  try {
    const roleList = await roleModel.getRoles(data.session.tenant);
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

  console.log("bodybody---------- ",body)
  let result = { hasError: false };
  try {
    const findResult = await roleModel.findByNameAndTenant(body.name,body.tenant);
    console.log("findResult---------- ",findResult)

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

const get = async (moduleName, req, logger) => {
  const { id: roleId } = req;
  const result = { hasError: false };
  try {
    const findResult = await roleModel.findById(roleId);
    if (!req.isSuperAdmin && findResult.tenant != req.tenant ) {
        result.hasError = true;
        result.code = HTTP_STATUS.NON_AUTHORITATIVE_INFORMATION;
        result.message = `UnAuthorized Access.`;
        logger.error(`UnAuthorized Access.`);
        
    }else{
      console.log("findResult---------------  ",findResult)

    if (findResult && Object.keys(findResult).length > 0) {
      const currentUser = await findUserById(req.userId);
      const isCurrentUserAdmin =
        currentUser && currentUser[0] ? currentUser[0].role === roleId || req.isSuperAdmin : false;
      const findPermissions = await roleModel.findPermissionsById(
        findResult.id
      );
      console.log("isCurrentUserAdmin---------------  ",isCurrentUserAdmin)
      const adminPermissions = isCurrentUserAdmin
        ? findPermissions.filter((perm) => perm.is_active === true)
        : await roleModel
            .findPermissionsById(currentUser[0].role)
            .then((Cpermissions) =>
              Cpermissions.filter((perm) => perm.is_active === true)
            );
console.log("adminPermissions----------  ",adminPermissions)

      const permissionList = await permissionModel.list();
    //  console.log("permissionList: ",permissionList.length)

      const generateArr = [];
      const newArr = permissionList.filter(
        (item) => item.permission_parent === null
      );
     // console.log("newArr: ",newArr)

      newArr.forEach((item) => {
        const newFilter = permissionList.filter(
          (obj) => obj.permission_parent === item.id
        );
   //     console.log("newFilter: ",newFilter)

        const allInactive = newFilter.every((p) => {
          const adminPermission = adminPermissions.find(
            (x) => x.permission_id === p.id
          );
          return !adminPermission || !adminPermission.is_active;
        });

        console.log("allInactive----------- ",allInactive)
        if (allInactive) {
          return;
        }
     
        const finalArr = newFilter.map((finalObj) => {
          const permissionResult = findPermissions.filter(
            (permissionItem) =>
              permissionItem.role_id === roleId &&
              permissionItem.permission_id === finalObj.id
          );
          if (permissionResult && permissionResult.length > 0) {
            return {
              ...finalObj,
              status: isCurrentUserAdmin
                ? false
                : permissionResult[0].is_active,
             isApply: permissionResult[0].is_active,
            };
          }
          return { ...finalObj, status: false, isApply: false};
        });
        generateArr.push({ name: item.name, data: finalArr });
      });

      const data = {
        id: roleId,
        name: findResult.name,
        desc: findResult.desc,
        data: generateArr,
      };
  console.log("generateArr ---------------  ",generateArr)
      if (generateArr.length > 0) {
        result.items = data;
        result.message = `${moduleName} list has been fetched successfully.`;
        result.code = HTTP_STATUS.OK;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to fetch role list.1`;
        logger.error(`Unable to fetch role list`);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch role list.2`;
      logger.error(`Unable to fetch role list`);
    }
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
const getPermissions = async (moduleName, req, logger) => {
  const result = { hasError: false };
  try {

      const currentUser = await findUserById(req.userId);
      const isCurrentUserSuperAdmin = req.isSuperAdmin;
      const findPermissions =  await roleModel.findPermissionsById(currentUser[0].role);
      console.log("findPermissions--------------------  ",findPermissions)
      console.log("isCurrentUserSuperAdmin---------------  ",isCurrentUserSuperAdmin)
      const adminPermissions =  await roleModel
            .findPermissionsById(currentUser[0].role)
            .then((Cpermissions) =>
              Cpermissions.filter((perm) => perm.is_active === true)
            );
//console.log("adminPermissions----------  ",adminPermissions)

      const permissionList = await permissionModel.list();
    //  console.log("permissionList: ",permissionList.length)

      const generateArr = [];
      const newArr = permissionList.filter(
        (item) => item.permission_parent === null
      );
     // console.log("permissionList  : ",newArr)

      newArr.forEach((item) => {
        const newFilter = permissionList.filter(
          (obj) => obj.permission_parent === item.id
        );


          const allInactive = newFilter.every((p) => {
            const adminPermission = adminPermissions.find(
              (x) => x.permission_id === p.id
            );
            return !adminPermission || !adminPermission.is_active;
          });

         // console.log("allInactive----------- ",allInactive)
          if (allInactive) {
            return;
          }
          const finalArr = newFilter.map((finalObj) => {
           // console.log("finalObj-------------- ",item)
            const permissionResult = findPermissions.filter(
              (permissionItem) =>
                permissionItem.role_id === currentUser[0].role &&
                permissionItem.permission_id === finalObj.id 
                
            );
            console.log("permissionResult-------------- ",permissionResult)

            if (permissionResult && permissionResult.length > 0 ) {
              if (permissionResult && Object.keys(permissionResult).length > 0) {
              return {
                ...finalObj

              };
             }
            }
         //  return { ...finalObj};
          }).filter(item => item && Object.keys(item).length > 0);
      //   const cleanedData = finalArr.filter(item => item && Object.keys(item).length > 0);

        //  console.log("cleanedData", cleanedData);
          generateArr.push({ name: item.name, data: finalArr });
  

            

      });

      const data = {
        data: generateArr,
      };
    console.log("generateArr ---------------  ",generateArr)
      if (generateArr.length > 0) {
        result.items = data;
        result.message = `${moduleName} list has been fetched successfully.`;
        result.code = HTTP_STATUS.OK;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to fetch permissions`;
        logger.error(`Unable to fetch permissions`);
      }
    // } else {
    //   result.hasError = true;
    //   result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    //   result.message = `Unable to fetch permissions`;
    //   logger.error(`Unable to fetch permissions `);
    // }
//  }
  } catch (error) {
    logger.error(
      `Unable to fetch list permissions.
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
  getPermissions,
};
