/* eslint-disable prefer-destructuring */
const { v4: uuidv4 } = require('uuid');
const Model = require('./employee.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const { hashAsync, isVerifyAsync } = require('../../../utils/security/bcrypt');
const uploader = require('../../../utils/s3Uploader/s3Uploader');
const OTP = require('../../../utils/security/otp');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');

const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { generateAccessToken } = require('../../../utils/security/oauth');
const {
  sendPasswordRecoveryMailForApp,
} = require('../../../config/nodeMailer');
const MODULE = require('../../../utils/constants/moduleNames');
const tenantModule = require('../../system/system.model');
// const {
//   APPOINTMENT_STATUS,
//   PAYMENT_STATUS,
// } = require('../../../utils/constants/enumConstants');

const login = async (moduleName, headers, body, logger) => {
  const result = { hasError: false };
  const userData = body;
  try {
    const tenantData = await tenantModule.tenantWithBranch(userData.tenant);
    // console.log('tenant::::::', tenantData);
    const tempUsers = await Model.loginService(userData.identifier, logger);

    // console.log('tempUsers:::::::', tempUsers);

    // const childTenant = tempUsers[0].tenant;
    if (tempUsers && tempUsers.length > 0) {
      // console.log(tempUsers);
      const tempUser = tempUsers[0];

      const checkTenant = tenantData.find(
        (item) => item.id === tempUser.tenant
      );

      if (!checkTenant) {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Your shop is not found`;
        logger.error(`Your shop is not found.`);
        return caseConversion.toCamelCase(result);
      }

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

      const passwordResult = await isVerifyAsync(
        userData.password,
        tempUser.password
      );
      if (passwordResult) {
        delete tempUser.password;
        // in case of super admin this will null or theme can be defined for super admin user
        if (tempUser.tenant && !tempUser.is_super_admin) {
          const accessToken = await generateAccessToken(
            { userId: tempUser.id, tenant: tempUser.tenant },
            tempUser.tenant
          );

          tempUser.token = accessToken;
          result.user = tempUser;
          result.message = `${moduleName} has been fetched successfully.`;
          result.code = HTTP_STATUS.OK;
        } else {
          result.hasError = true;
          result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          result.message = `There is an error in sign-in, please check the username and password.`;
          logger.error(`${moduleName} user does not found.`);
        }
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `There is an error in sign-in, please check the username and password.`;
        logger.error(`${moduleName} user does not found.`);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Invalid username or password`;
      logger.error(`${moduleName} Invalid username or password.`);
      return caseConversion.toCamelCase(result);
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

const attendanceScan = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const scanChecked = await Model.attendanceScan(uriParams, newBody);
    if (scanChecked) {
      result.item = scanChecked;
      // result = { ...result };
      result.message = `${moduleName} scan has been checked successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to scan ${moduleName}.`;
      logger.error(`Unable to scan ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch scan ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const registerDevice = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const updateResult = await Model.registerDevice(uriParams, newBody);
    if (updateResult) {
      result.item = updateResult;
      // result = { ...result };
      result.message = `${moduleName} register device has been updated successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to register device ${moduleName}.`;
      logger.error(`Unable to register device ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to register device ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const attendanceCheck = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.attendanceCheck(uriParams);
    if (findResult) {
      result.item = findResult;
      // result = { ...result };
      result.message = `${moduleName} attendance has been checked successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to check attendance ${moduleName}.`;
      logger.error(`Unable to check attendance ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to check attendance ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const attendanceWeekly = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.attendanceWeekly(uriParams);
    if (findResult) {
      result.item = findResult;
      // result = { ...result };
      result.message = `${moduleName} weekly attendance fetch successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch weekly attendance ${moduleName}.`;
      logger.error(`Unable to fetch weekly attendance ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch weekly attendance ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const leaveManagement = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findRecords = await Model.leaveManagement(uriParams);
    if (findRecords) {
      result.items = findRecords;
      // result = { ...result };
      result.message = `${moduleName} leave management has been fetch successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch leave management ${moduleName}.`;
      logger.error(`Unable to fetch leave management ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch leave management ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const leaveManagementCreate = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  const attachments = Array.isArray(newBody.attachment)
    ? newBody.attachment
    : [newBody.attachment];
  delete newBody.attachment;
  try {
    let attachmentPromiseArr = [];
    if (attachments && attachments.length > 0) {
      attachmentPromiseArr = attachments.map(async (item) => {
        const fileExt = item.filename.split('.').pop();
        const fileData = {
          Key: `menu/${uuidv4()}-${item.filename}`,
          Body: item.buffer,
          'Content-Type': item.mimetype,
        };
        const img = await uploader.uploadToAdminBucket(fileData);
        if (img) {
          return { file: img.Location, attachment_extension: fileExt };
        }
        return null;
      });
    }
    const attachmentArr = await Promise.all(attachmentPromiseArr);
    newBody = caseConversion.toSnakeCase(newBody);
    const insertRecord = await Model.leaveManagementCreate(
      uriParams,
      newBody,
      attachmentArr
    );
    if (insertRecord) {
      result.item = insertRecord;
      // result = { ...result };
      result.message = `${moduleName} leave management has been created successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create leave management ${moduleName}.`;
      logger.error(`Unable to create leave management ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to create leave management ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const payroll = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findRecords = await Model.payroll(uriParams);
    if (findRecords) {
      result.items = findRecords;
      // result = { ...result };
      result.message = `${moduleName} leave management has been fetch successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch leave management ${moduleName}.`;
      logger.error(`Unable to fetch leave management ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch leave management ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const profile = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findRecord = await Model.profile(uriParams);
    if (findRecord) {
      result.item = findRecord;
      // result = { ...result };
      result.message = `${moduleName} profile has been fetch successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch profile ${moduleName}.`;
      logger.error(`Unable to fetch profile ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch profile ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const schedule = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findRecord = await Model.schedule(uriParams);
    if (findRecord) {
      result.item = findRecord;
      // result = { ...result };
      result.message = `${moduleName} schedule has been fetch successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch schedule ${moduleName}.`;
      logger.error(`Unable to fetch schedule ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch schedule ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const changeProfileAvatar = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  const newBody = body;
  const file = newBody.avatar;
  delete newBody.avatar;
  try {
    if (file) {
      const fileData = {
        Key: `menu/${uuidv4()}-${file.filename}`,
        Body: file.buffer,
        'Content-Type': file.mimetype,
      };
      const img = await uploader.uploadToAdminBucket(fileData);
      if (img) {
        newBody.avatar = img.Location;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to change profile avatar.`;
        logger.error(`Unable to change profile avatar`);
        return caseConversion.toCamelCase(result);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `avatar is not found.`;
      logger.error(`avatar is not found`);
      return caseConversion.toCamelCase(result);
    }
    const [updateRecord] = await Model.update(uriParams, newBody);
    if (updateRecord) {
      delete updateRecord.password;
      result.item = updateRecord;
      // result = { ...result };
      result.message = `${moduleName} profile avatar has been changed successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to change profile avatar ${moduleName}.`;
      logger.error(`Unable to change profile avatar ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to change profile avatar ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const forgotPassword = async (userData, logger) => {
  let appUser = { hasError: false };
  try {
    const user = await Model.findByEmployee(userData);
    const OPT_KEY = `EMPLOYEE_PASSWORD_RECOVERY:${user.email}`;
    const otp = await OTP.getOTP(OPT_KEY);
    const sentMessageInfo = await sendPasswordRecoveryMailForApp(
      user.email,
      otp
    );
    if (sentMessageInfo) {
      appUser = { ...appUser, data: sentMessageInfo };
      appUser.message = `recovery email has been sent`;
    }
  } catch (error) {
    logger.error(
      `Unable to update status ${MODULE.STORE.EMPLOYEE}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return caseConversion.toCamelCase(appUser);
};

const resetPassword = async (userData, logger) => {
  let newUserData = userData;
  const appUser = { hasError: false };
  try {
    const OPT_KEY = `EMPLOYEE_PASSWORD_RECOVERY:${newUserData.email}`;
    const isCorrectOTP = await OTP.verifyOTP(OPT_KEY, newUserData.otp);
    if (!isCorrectOTP) {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Invalid otp, please check the otp.`;
      logger.error(
        `Unable to verify otp ${MODULE.STORE.EMPLOYEE}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
      return caseConversion.toCamelCase(appUser);
    }
    delete newUserData.otp;
    newUserData.password = await hashAsync(newUserData.password);
    newUserData = caseConversion.toSnakeCase(newUserData);
    const userResult = await Model.resetEmployeePassword(newUserData);
    if (userResult) {
      appUser.message = `your password reset successfully.`;
      await OTP.removeOTP(OPT_KEY);
    }
  } catch (error) {
    logger.error(
      `Unable to reset password ${MODULE.STORE.EMPLOYEE}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return caseConversion.toCamelCase(appUser);
};

module.exports = {
  login,
  attendanceScan,
  attendanceCheck,
  attendanceWeekly,
  leaveManagement,
  leaveManagementCreate,
  payroll,
  profile,
  schedule,
  changeProfileAvatar,
  registerDevice,
  forgotPassword,
  resetPassword,
};
