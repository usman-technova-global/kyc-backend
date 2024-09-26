const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const backOfficeUserModel = require('./backofficeUser.model');
const roleModel = require('../../superadmin/role/role.model');
const tenantModel = require('../../superadmin/tenant/tenant.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const { hashAsync, isVerifyAsync } = require('../../../utils/security/bcrypt');
const JwtAuth = require('../../../utils/security/oauth');
const OTP = require('../../../utils/security/otp');
const systemModel = require('../../system/system.model');
const {
  getAuthTokensForAdmin,
  /* generateRefreshToken, */
} = require('../../../utils/security/oauth');
const { newEmail } = require('../../email/email.service');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const uploader = require('../../../utils/s3Uploader/s3Uploader');
const {
  BACK_OFFICE_USER_PASSWORD_TYPE,
  BACK_OFFICE_USER_TYPE,
} = require('../../../utils/constants/enumConstants');
const { getValue, removeValue } = require('../../../config/redisClient');
const { getTenant } = require('../../../utils/security/secureAdminRoutes');
const { sendSignUpMail } = require('../../../config/nodeMailer');
const MODULE = require('../../../utils/constants/moduleNames');

const listUsers = async (moduleName, logger) => {
  let userList = { hasError: false };
  try {
    const users = await backOfficeUserModel.listUsers();
    if (users) {
      userList = { ...userList, users };
      userList.message = `${moduleName} list has been fetched successfully.`;
      userList.code = HTTP_STATUS.OK;
    } else {
      userList.hasError = true;
      userList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      userList.message = `Unable to fetch backOffice list.`;
      logger.error(`Unable to fetch backOffice list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list backOffice list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    userList.hasError = true;
    userList.message = error.detail;
    userList.code = error.code;
  }
  return caseConversion.toCamelCase(userList);
};

const findUserById = async (moduleName, id, logger) => {
  let user = { hasError: false };
  try {
    const tempUsers = await backOfficeUserModel.findUserById(id, logger);
    if (tempUsers && tempUsers.length > 0) {
      const tempUser = tempUsers[0];
      user = { ...user, user: tempUser };
      user.message = `${moduleName} has been fetched successfully.`;
    } else {
      user.hasError = true;
      user.code = HTTP_STATUS.NOT_FOUND;
      user.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        UserId:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${id}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    user.hasError = true;
    user.message = error.detail;
    user.code = error.code;
  }
  return caseConversion.toCamelCase(user);
};

const createUser = async (moduleName, userData, logger) => {
  const newUserData = userData;
  let user = { hasError: false };
  try {
    newUserData.id = uuidv4();
    newUserData.is_active = true;
    const userResult = await backOfficeUserModel.createUser(newUserData);
    if (userResult && userResult.rowCount > 0) {
      user = { ...user, user: newUserData };
      user.message = `${moduleName} has been created successfully.`;
    } else {
      user.hasError = true;
      user.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      user.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    user.hasError = true;
    user.message = error.detail;
    user.code = error.code;
  }

  return caseConversion.toCamelCase(user);
};

const login = async (moduleName, protocol, headers, userData, logger) => {
  const result = { hasError: false };
  try {
    const urlStr = headers.origin ?? headers.referer;
    let url;
    if (headers['user-agent']) {
      if (headers['user-agent']) {
        if (headers['user-agent'].includes('PostmanRuntime')) {
          url = new URL('http://localhost:3200');
        } else {
          url = new URL(urlStr);
        }
      } else {
        url = new URL(urlStr);
      }
    } else if (urlStr) {
      url = new URL(urlStr);
    } else {
      url = new URL(`${protocol}://${headers.host}`);
    }

    const systemConfig = await systemModel.findByDomain(
      url.hostname.split('.')[process.env.HOST_SPLIT]
    );

    console.log(
      'systemConfig: ',
      url.hostname.split('.')[process.env.HOST_SPLIT]
    );
    console.log('url.hostname : ', url.hostname);
    console.log('url : ', url);

    if (!systemConfig) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Domain not found`;
      logger.error(`Domain not found`);
      return caseConversion.toCamelCase(result);
    }

    const tempUsers = await backOfficeUserModel.loginService(
      userData.username,
      logger
    );

    // const childTenant = tempUsers[0].tenant;
    // console.log('systemConfig::::::', systemConfig);
    // console.log('tempUsers:::::::', tempUsers);
    if (tempUsers && tempUsers.length > 0) {
      const parentTenant = systemConfig.tenant;
      const tempUser = tempUsers[0];
      console.log('tempUser: ', tempUsers[0]);

      const tenantQuery = await tenantModel.getTenantQuery(parentTenant);

      console.log('tenantQuery: ', tenantQuery);

      // const tenantExist = tenantQuery.find(
      //   (item) => item.id === tempUser.tenant
      // );

      // if (!tenantExist) {
      //   result.hasError = true;
      //   result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      //   result.message = `Tenant not found`;
      //   logger.error(`Tenant not found`);
      //   return caseConversion.toCamelCase(result);
      // }

      // if (!tempUser.is_super_admin) {
      if (tempUser.is_deleted) {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Your account has been deleted.`;
        logger.error(`${moduleName} user account is deleted.`);
        return caseConversion.toCamelCase(result);
      }
      if (!tempUser.is_active) {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Your account has been deactivated.`;
        logger.error(`${moduleName} user account is deactivated.`);
        return caseConversion.toCamelCase(result);
      }
      if (tempUser.tenant) {
        const findTenant = await tenantModel.findById(tempUser.tenant);
        if (findTenant && findTenant.length > 0) {
          if (findTenant[0].trial_start_date) {
            const addTime = moment(findTenant[0].trial_start_date).add(
              Number(findTenant[0].trial_mode_limit),
              'days'
            );
            const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
            if (currentDate > addTime) {
              result.hasError = true;
              result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
              result.message = `Your account has been expired.`;
              logger.error(`${moduleName} user account is expired.`);
              return caseConversion.toCamelCase(result);
            }
          }
        }
      }

      const passwordResult = await isVerifyAsync(
        userData.password,
        tempUser.password
      );
      // console.log('passwordResult:::::', passwordResult);
      if (passwordResult) {
        delete tempUser.password;
        // in case of super admin this will null or theme can be defined for super admin user
        // if (tempUser.tenant && !tempUser.is_super_admin) {
        if (tempUser.tenant) {
          const tenant = await tenantModel.findTenantByIdWithConfig(
            tempUser.tenant
          );
          if (tenant) {
            tempUser.tenant_config = tenant.tenant_config;
            tempUser.tenant_name = tenant.name;
            tempUser.employee_limit = tenant.user_limit;
            tempUser.max_employee_limit = tenant.max_user_limit;
            tempUser.branch_limit = tenant.max_branch_limit;
            tempUser.trial_mode = tenant.trial_mode;
            tempUser.trial_start_date = tenant.trial_start_date;
            tempUser.trial_mode_limit = tenant.trial_mode_limit;
          }
        }
        // else {
        //   result.hasError = true;
        //   result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        //   result.message = `Shop not found.`;
        //   logger.error(`${moduleName} Shop not found.`);
        // }
        // Fetch and assign role & permissions
        if (tempUser.role) {
          const rolePermissions = await roleModel.findUserByIdWithPermissions(
            tempUser.role
          );
          if (rolePermissions && rolePermissions.rows.length > 0) {
            const [firstObject] = rolePermissions.rows;
            tempUser.role = firstObject;
          } else {
            tempUser.role = [];
          }
        } else {
          tempUser.role = [];
        }

        // console.log('getTenantQuery:::::', getTenantQuery);
        const [accessToken, refreshToken] = await getAuthTokensForAdmin(
          {
            userId: tempUser.id,
            tenant: tempUser.tenant,
            isSuperAdmin: tempUser.is_super_admin,
            role: tempUser.role,
          },
          parentTenant
        );

        tempUser.access_token = accessToken;
        tempUser.refresh_token = refreshToken;

        result.user = tempUser;
        result.message = `${moduleName} has been fetched successfully.`;
        result.code = HTTP_STATUS.OK;
        //  console.log("result--------------  ",result)
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `There is an error in sign-in, please check the username and password.`;
        logger.error(`${moduleName} invalid password.`);
      }
      // } else {
      //   result.hasError = true;
      //   result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      //   result.message = `Super admin account is not allowed.`;
      //   logger.error(`${moduleName} Super admin account is not allowed.`);
      // }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `There is an error in sign-in, please check the username and password.`;
      logger.error(`${moduleName} user does not found.`);
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

const createPassword = async (moduleName, body, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await backOfficeUserModel.findUserByCode(
      body.code,
      logger
    );
    if (findResult && Object.keys(findResult).length > 0) {
      const tempUser = findResult;
      const confirmCode = await isVerifyAsync(tempUser.username, body.code);
      if (!confirmCode) {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Your user code is not matched.`;
        logger.error(`${moduleName} user code is not matched.`);
        return caseConversion.toCamelCase(result);
      }
      const newPassword = await hashAsync(body.password);
      const updateResult = await backOfficeUserModel.update(tempUser.id, {
        password: newPassword,
        is_active: true,
        password_type: BACK_OFFICE_USER_PASSWORD_TYPE.NEW,
      });
      if (updateResult) {
        return login(
          moduleName,
          {
            username: findResult.username,
            password: body.password,
          },
          logger
        );
      }
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Password not updated.`;
      logger.error(`${moduleName} user query not execute.`);
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `User credential does not found.`;
      logger.error(`${moduleName} user credential does not found.`);
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

const list = async (moduleName, param, logger) => {
  const newParam = param;
  const result = { hasError: false, users: { list: [], total: 0 } };
  try {
    // console.log('newParam::::::', newParam);
    const userId = await backOfficeUserModel.findByUserTenantIdShopOrBranch(
      newParam.tenant
    );
    // console.log('userId:::::::', userId);
    newParam.userId = userId.id;
    const total = await backOfficeUserModel.count(newParam);
    const users = await backOfficeUserModel.list(newParam);
    // console.log('users:::::::', users);
    if (users) {
      const newArr = users.map((item) => {
        const newItem = item;
        delete newItem.password;
        return newItem;
      });
      result.users.list = newArr;
      result.users.total = parseInt(total[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch backOffice list.`;
      logger.error(`Unable to fetch backOffice list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list backOffice list.
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
  const newParam = param;
  const result = { hasError: false, users: { list: [], total: 0 } };
  try {
    const userId = await backOfficeUserModel.findByUserTenantIdShop(
      newParam.tenant
    );
    newParam.userId = userId.id;
    const total = await backOfficeUserModel.countWithSearch(newParam);
    const dataList = await backOfficeUserModel.search(newParam);
    if (dataList) {
      const newArr = dataList.rows.map((item) => {
        const newItem = item;
        delete newItem.password;
        return newItem;
      });
      result.users.list = newArr;
      result.users.total = parseInt(total.rows[0].count, 10);
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
const edit = async (moduleName, userId, logger) => {
  let result = { hasError: false };
  try {
    const resultData = await backOfficeUserModel.edit(userId);
    if (resultData && Object.keys(resultData).length > 0) {
      const tempData = resultData;
      delete tempData.password;
      result = { ...result, user: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        userId:: ${userId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${userId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const insert = async (moduleName, body, logger) => {
  let newBody = body;

  // console.log('newBody:::::', newBody);
  let result = { hasError: false };
  try {
    const checkEmployeeLimit = await backOfficeUserModel.checkEmployeeLimit(
      newBody.tenant
    );
    if (checkEmployeeLimit) {
      const newPassword = await hashAsync(newBody.password);
      if (newPassword) {
        newBody = {
          id: uuidv4(),
          firstName: newBody.firstName,
          lastName: newBody.lastName,
          username: newBody.email,
          email: newBody.email,
          password: newPassword,
          tenant: newBody.tenant,
          role: newBody.role ?? null,
          isActive: true,
          isDeleted: false,
          isSuperAdmin: false,
          createdBy: newBody.createdBy,
          updatedBy: newBody.createdBy,
          passwordType: BACK_OFFICE_USER_PASSWORD_TYPE.NEW,
          parent: newBody.createdBy,
          userType: BACK_OFFICE_USER_TYPE.USER,
        };
        newBody = caseConversion.toSnakeCase(newBody);
        const userResult = await backOfficeUserModel.insert(newBody);
        if (userResult && Object.keys(userResult).length > 0) {
          delete newBody.password;
          result = { ...result, user: newBody };
          const emailSent = await newEmail('Email', userResult[0].id, logger);
          result.message = `${moduleName} has been created successfully. ${emailSent}`;

          // result.message = `${moduleName} has been created successfully.`;
        } else {
          delete newBody.password;
          result.hasError = true;
          result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          result.message = `Unable to create ${moduleName}. please check the payload.`;
          logger.error(
            `Unable to create ${moduleName}.
          Payload:: ${prettyPrintJSON(result)}`
          );
        }
      } else {
        delete newBody.password;
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to create ${moduleName}. password is not convert.`;
        logger.error(
          `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      delete newBody.password;
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. user limit has been exceeded.`;
      logger.error(`Create user limit has been exceeded`);
    }
  } catch (error) {
    delete newBody.password;
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
const update = async (moduleName, userId, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await backOfficeUserModel.edit(userId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody = {
        firstName: newBody.firstName,
        lastName: newBody.lastName,
        updatedBy: newBody.updatedBy,
        role: newBody.role,
        // avatar: body.avatar
      };
      newBody.updated_date = new Date();

      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await backOfficeUserModel.update(userId, newBody);
      if (updateResult) {
        newBody.id = findResult.id;
        result = { ...result, user: newBody };
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

const updateStatus = async (moduleName, userId, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await backOfficeUserModel.edit(userId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await backOfficeUserModel.update(userId, newBody);
      if (updateResult) {
        newBody.id = findResult.id;
        result = { ...result, user: newBody };
        result.message = `${moduleName} has been updated status successfully.`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update status ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to update status ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update status ${moduleName}. please check the id.`;
      logger.error(
        `Unable to update status ${moduleName}.
        Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
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

const deleteUser = async (moduleName, userId, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await backOfficeUserModel.edit(userId);
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.isActive = false;
      newBody.isDeleted = true;
      newBody.updated_date = new Date();
      newBody = caseConversion.toSnakeCase(newBody);
      const updateResult = await backOfficeUserModel.update(userId, newBody);
      if (updateResult) {
        newBody.id = findResult.id;
        result = { ...result, user: newBody };
        result.message = `${moduleName} has been deleted successfully.`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to deleted ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to delete ${moduleName}.
          Payload:: ${prettyPrintJSON(newBody)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete ${moduleName}. please check the id.`;
      logger.error(
        `Unable to delete ${moduleName}.
        Payload:: ${prettyPrintJSON(newBody)}`
      );
    }
  } catch (error) {
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

const profile = async (moduleName, userId, logger) => {
  let result = { hasError: false };
  try {
    const resultData = await backOfficeUserModel.profile(userId);
    if (resultData && Object.keys(resultData).length > 0) {
      const tempData = resultData;
      delete tempData.password;
      result = { ...result, user: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        userId:: ${userId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${userId}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const profileUpdate = async (moduleName, body, logger) => {
  console.log('body--------------- ', body);
  let newBody = body;
  const file = newBody.avatar;
  delete newBody.avatar;
  let result = { hasError: false };
  try {
    if (file) {
      const fileData = {
        Key: `menu/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      newBody.avatar = img.Location;
    } else {
      newBody.avatar = null;
    }
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const updateResult = await backOfficeUserModel.profileUpdate(newBody);
    if (updateResult) {
      const findResult = await backOfficeUserModel.profile(newBody.id);
      result = { ...result, user: findResult };
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

const secretUpdate = async (moduleName, body, logger) => {
  const newBody = body;
  let result = { hasError: false };
  try {
    const findUser = await backOfficeUserModel.findById(newBody.id);
    const passwordResult = await isVerifyAsync(
      newBody.currentParole,
      findUser.password
    );
    if (passwordResult) {
      const newPassword = await hashAsync(newBody.newParole);
      if (newPassword) {
        let data = {
          password: newPassword,
          updatedBy: newBody.id,
          updatedDate: new Date(),
        };
        data = caseConversion.toSnakeCase(data);
        const updateResult = await backOfficeUserModel.update(newBody.id, data);
        if (updateResult) {
          result = { ...result, user: {} };
          result.message = `${moduleName} has been updated successfully.`;
        } else {
          result.hasError = true;
          result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          result.message = `Unable to change secret ${moduleName}.`;
          logger.error(`Unable to change secret ${moduleName}.`);
        }
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `New password does not generate.`;
        logger.error(`New password does not generate.`);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Old password does not match.`;
      logger.error(`Old password does not match.`);
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

const refreshToken = async (headers, logger) => {
  const result = { hasError: false };
  try {
    const token = headers.authorization;
    const url = new URL(headers.origin ?? headers.referer);
    const systemConfigTenant = await getTenant(
      url.hostname.split('.')[process.env.HOST_SPLIT]
    );
    if (!systemConfigTenant) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Domain not found`;
      logger.error(`Domain not found`);
      return caseConversion.toCamelCase(result);
    }
    const storeToken = await getValue(systemConfigTenant, token);

    const verificationResult =
      await JwtAuth.verifyRefreshTokenForAdmin(storeToken);
    if (!verificationResult.result) {
      result.hasError = true;
      result.code = HTTP_STATUS.UNAUTHORIZED;
      result.message = verificationResult.message;
      logger.error(verificationResult.message);
      return caseConversion.toCamelCase(result);
    }

    const data = JwtAuth.decodeToken(storeToken);
    const [accessToken, refreshNewToken] = await getAuthTokensForAdmin(
      data.payload,
      systemConfigTenant
    );
    await removeValue(systemConfigTenant, token);

    result.item = {
      access_token: accessToken,
      refresh_token: refreshNewToken,
    };
    result.message = `refresh token has been successfully generated.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `refresh token failed.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const getOTP = async (OTPData, headers, logger) => {
  let result = { hasError: false };
  try {
    const url = new URL(headers.origin ?? headers.referer);
    const findUser = await backOfficeUserModel.findUserByAllTenants(
      OTPData.email,
      url.hostname.split('.')[process.env.HOST_SPLIT]
    );
    if (!findUser) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `User not found, Please check the register email.`;
      logger.error(
        `User not found ${MODULE.BACK_OFFICE_USER}.
        Payload:: ${prettyPrintJSON(OTPData)}`
      );
      return caseConversion.toCamelCase(result);
    }
    const otp = await OTP.getOTP(OTPData.email);
    const sentMessageInfo = await sendSignUpMail(OTPData.email, otp);
    if (sentMessageInfo) {
      result = { ...result, data: sentMessageInfo };
      result.message = `email has been sent`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to send email, please check the payload.`;
      logger.error(
        `Unable to send email ${MODULE.BACK_OFFICE_USER}.
        Payload:: ${prettyPrintJSON(OTPData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to send email ${MODULE.BACK_OFFICE_USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(OTPData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const changePassword = async (userData, logger) => {
  let newUserData = userData;
  let result = { hasError: false };
  try {
    const [findUser] = await backOfficeUserModel.findUserByEmail(
      newUserData.email
    );
    if (!findUser) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `User not found, Please check the register email.`;
      logger.error(
        `User not found ${MODULE.BACK_OFFICE_USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
      return caseConversion.toCamelCase(result);
    }
    const isCorrectOTP = await OTP.verifyOTP(
      newUserData.email,
      newUserData.otp
    );
    if (!isCorrectOTP) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Invalid otp, please check the otp.`;
      logger.error(
        `Unable to verify otp ${MODULE.BACK_OFFICE_USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
      return caseConversion.toCamelCase(result);
    }
    delete newUserData.otp;
    delete newUserData.email;
    newUserData.password = await hashAsync(newUserData.password);
    newUserData.updated_date = new Date();
    newUserData = caseConversion.toSnakeCase(newUserData);
    const userResult = await backOfficeUserModel.update(
      findUser.id,
      newUserData
    );
    if (userResult) {
      newUserData.id = findUser.id;
      newUserData.email = findUser.email;
      delete newUserData.password;

      result = { ...result, user: newUserData };
      result.message = `your password has been changed successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to change your password, please check the payload.`;
      logger.error(
        `Unable to change password ${MODULE.BACK_OFFICE_USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to change password ${MODULE.BACK_OFFICE_USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const anonymousDetail = async (uriParam, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await backOfficeUserModel.anonymousDetail(uriParam);

    if (!findResult) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to find backoffice user.`;
      logger.error(`Unable to find backoffice user.`);
      return caseConversion.toCamelCase(result);
    }

    result.item = findResult;
    result.message = `backoffice user has been successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(`Unable to find backoffice user`);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = {
  listUsers,
  findUserById,
  createUser,
  login,
  createPassword,
  list,
  search,
  edit,
  insert,
  update,
  updateStatus,
  deleteUser,
  profile,
  profileUpdate,
  secretUpdate,
  refreshToken,
  getOTP,
  changePassword,
  anonymousDetail,
};
