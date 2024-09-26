const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const appUserModel = require('./appUser.model');
const { hashAsync, isVerifyAsync } = require('../../../utils/security/bcrypt');
const OTP = require('../../../utils/security/otp');
const {
  sendSignUpMail,
  sendPasswordRecoveryMailForDriver,
  sendPasswordRecoveryMailForApp,
} = require('../../../config/nodeMailer');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  generateAccessToken,
  // generateRefreshToken,
} = require('../../../utils/security/oauth');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const { promiseHandler } = require('../../../utils/commonUtils/promiseHandler');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const createUser = async (userData) => {
  let newUserData = userData;
  let appUser = { hasError: false };
  try {
    const isCorrectOTP = await OTP.verifyOTP(
      newUserData.email,
      newUserData.otp
    );
    if (!isCorrectOTP) {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Invalid otp, please check the otp.`;
      logger.error(
        `Unable to verify otp ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
      return toCamelCase(appUser);
    }
    delete newUserData.otp;
    newUserData.id = uuidv4();
    newUserData.isActive = true;
    newUserData.password = await hashAsync(newUserData.password);
    newUserData = toSnakeCase(newUserData);
    const userResult = await appUserModel.createUser(newUserData);
    if (userResult && userResult.rowCount > 0) {
      delete newUserData.password;
      appUser = { ...appUser, user: newUserData };
      appUser.user.token = generateAccessToken({
        userId: newUserData.id,
        tenantId: newUserData.tenant,
      });
      appUser.message = `your profile has been created successfully.`;
    } else {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Unable to create your profile, please check the payload.`;
      logger.error(
        `Unable to create ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const updateUser = async (userData) => {
  let newUserData = userData;
  let appUser = { hasError: false };
  try {
    newUserData.updatedDate = new Date();
    if (userData.newPassword !== userData.verifyPassword) {
      appUser.hasError = true;
      appUser.message = 'Password Does Not Match';
      appUser.code = HTTP_STATUS.BAD_REQUEST;
      return toCamelCase(appUser);
    }
    const user = await appUserModel.getUserPassword(newUserData.id);
    if (newUserData.currentPassword) {
      const isPasswordValid = await isVerifyAsync(
        newUserData.currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        appUser.hasError = true;
        appUser.message = 'Invalid Current Password';
        appUser.code = HTTP_STATUS.CONFLICT;
        return toCamelCase(appUser);
      }
      if (newUserData.newPassword) {
        newUserData.password = await hashAsync(newUserData.newPassword);
      }
    }

    delete newUserData.newPassword;
    delete newUserData.verifyPassword;
    delete newUserData.currentPassword;
    newUserData = toSnakeCase(newUserData);
    const [userResult] = await appUserModel.updateUser(newUserData);
    delete userResult.password;
    delete userResult.isDeleted;
    if (userResult) {
      appUser = { ...appUser, user: userResult };
      appUser.message = `your profile has been updated successfully.`;
    } else {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Unable to update your profile, please check the payload.`;
      logger.error(
        `Unable to update ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to update ${MODULE.APP.USER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const getOTP = async (OTPData, param) => {
  let appOTP = { hasError: false };
  try {
    const findEmail = await appUserModel.findByEmail(param, OTPData.email);
    if (findEmail) {
      appOTP.hasError = true;
      appOTP.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOTP.message = `Email is already exist.`;
      logger.error(`Email is already exist.`);
      return toCamelCase(appOTP);
    }
    const otp = await OTP.getOTP(OTPData.email);
    const sentMessageInfo = await sendSignUpMail(OTPData.email, otp);
    if (sentMessageInfo) {
      appOTP = { ...appOTP, data: sentMessageInfo };
      appOTP.message = `email has been sent`;
    } else {
      appOTP.hasError = true;
      appOTP.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOTP.message = `Unable to send email, please check the payload.`;
      logger.error(
        `Unable to send email ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(OTPData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to send email ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(OTPData)}`
    );
    appOTP.hasError = true;
    appOTP.message = error.detail;
    appOTP.code = error.code;
  }
  return toCamelCase(appOTP);
};

const signIn = async (userData) => {
  let appUser = { hasError: false };
  try {
    const userResult = await appUserModel.findUser(userData);
    const verifyUser = await isVerifyAsync(
      userData.password,
      userResult.password
    );
    if (verifyUser) {
      delete userResult.password;
      userResult.token = generateAccessToken({
        userId: userResult.id,
        tenantId: userResult.tenant,
      });
      appUser = { ...appUser, user: userResult };
      appUser.message = `sign in successful`;
    } else {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `invalid credentials`;
      logger.error(
        `Unable to sign in ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(userData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to sign in ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const signInAppFacebook = async (userData) => {
  let appUser = { hasError: false };
  try {
    const fields = ['email', 'name'];
    const url = new URL(`https://graph.facebook.com/me`);
    url.searchParams.append('fields', fields.join(', '));
    url.searchParams.append('access_token', userData.accessToken);

    const getUserDataPromise = axios.get(url);
    const [getUserDataResult, getUserDataError] =
      await promiseHandler(getUserDataPromise);
    if (!getUserDataResult) {
      logger.error(`${prettyPrintJSON(getUserDataError)}`);
      const noFacebookUser = new Error('Invalid Access Token');
      noFacebookUser.code = HTTP_STATUS.BAD_REQUEST;
      noFacebookUser.detail = 'Invalid Access Token';
      throw noFacebookUser;
    }
    const password = `FB${getUserDataResult.id}FB`;
    const hashedPassword = await hashAsync(password);
    const userResult = await appUserModel.signInAppFacebook({
      ...getUserDataResult.data,
      tenant: userData.tenant,
      password: hashedPassword,
    });
    const verifyUser = await isVerifyAsync(password, userResult.password);
    if (verifyUser) {
      delete userResult.password;
      userResult.token = generateAccessToken({
        userId: userResult.id,
        tenantId: userResult.tenant,
      });
      appUser = { ...appUser, user: userResult };
      appUser.message = `sign in successful`;
    } else {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `invalid credentials`;
      logger.error(
        `Unable to login with facebook ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(userData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to login with facebook ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const getProfile = async (userData) => {
  let appUser = { hasError: false };
  try {
    const userProfile = await appUserModel.getProfile(userData);
    appUser = { ...appUser, user: userProfile };
    appUser.message = `profile fetched successful`;
  } catch (error) {
    logger.error(
      `Unable to fetched profile ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const setStatus = async (userData) => {
  let appUser = { hasError: false };
  try {
    await appUserModel.setStatus(userData);
    appUser = { ...appUser, user: null };
    appUser.message = `status updated Successfully`;
  } catch (error) {
    logger.error(
      `Unable to update status ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const forgotPasswordDriver = async (userData) => {
  let appUser = { hasError: false };
  try {
    const user = await appUserModel.findUser(userData);
    const OPT_KEY = `DRIVER_PASSWORD_RECOVERY:${user.email}`;
    const otp = await OTP.getOTP(OPT_KEY);
    const sentMessageInfo = await sendPasswordRecoveryMailForDriver(
      user.email,
      otp
    );
    if (sentMessageInfo) {
      appUser = { ...appUser, data: sentMessageInfo };
      appUser.message = `recovery email has been sent`;
    }
  } catch (error) {
    logger.error(
      `Unable to update status ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const resetPasswordDriver = async (userData) => {
  let newUserData = userData;
  const appUser = { hasError: false };
  try {
    const OPT_KEY = `DRIVER_PASSWORD_RECOVERY:${newUserData.email}`;
    const isCorrectOTP = await OTP.verifyOTP(OPT_KEY, newUserData.otp);
    if (!isCorrectOTP) {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Invalid otp, please check the otp.`;
      logger.error(
        `Unable to verify otp ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
      return toCamelCase(appUser);
    }
    delete newUserData.otp;
    newUserData.password = await hashAsync(newUserData.password);
    newUserData = toSnakeCase(newUserData);
    const userResult = await appUserModel.resetDriverPassword(newUserData);
    if (userResult) {
      appUser.message = `your password reset successfully.`;
      await OTP.removeOTP(OPT_KEY);
    }
  } catch (error) {
    logger.error(
      `Unable to reset password ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const forgotPasswordApp = async (userData) => {
  let appUser = { hasError: false };
  try {
    const user = await appUserModel.findUser(userData);
    const OPT_KEY = `USER_PASSWORD_RECOVERY:${user.email}`;
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
      `Unable to update status ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(userData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const resetPasswordApp = async (userData) => {
  let newUserData = userData;
  const appUser = { hasError: false };
  try {
    const OPT_KEY = `USER_PASSWORD_RECOVERY:${newUserData.email}`;
    const isCorrectOTP = await OTP.verifyOTP(OPT_KEY, newUserData.otp);
    if (!isCorrectOTP) {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Invalid otp, please check the otp.`;
      logger.error(
        `Unable to verify otp ${MODULE.APP.USER}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
      return toCamelCase(appUser);
    }
    delete newUserData.otp;
    newUserData.password = await hashAsync(newUserData.password);
    newUserData = toSnakeCase(newUserData);
    const userResult = await appUserModel.resetUserPassword(newUserData);
    if (userResult) {
      appUser.message = `your password reset successfully.`;
      await OTP.removeOTP(OPT_KEY);
    }
  } catch (error) {
    logger.error(
      `Unable to reset password ${MODULE.APP.USER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
};

const loyaltyHistoryList = async (param, session) => {
  const result = { hasError: false, items: { list: 0, total: 0 } };
  try {
    const newParam = param;
    newParam.appUser = session.userId;
    newParam.tenant = session.tenantId;
    const findResult = await appUserModel.loyaltyHistoryList(newParam);
    if (findResult) {
      result.items.list = findResult.list;
      result.items.total = parseInt(findResult.total, 10);
      result.message = `${MODULE.ADMIN.LOYALTY_HISTORY} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch loyalty history list.`;
      logger.error(`Unable to fetch loyalty history list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch loyalty history list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return toCamelCase(result);
};

module.exports = {
  createUser,
  updateUser,
  getOTP,
  signIn,
  getProfile,
  setStatus,
  forgotPasswordDriver,
  resetPasswordDriver,
  forgotPasswordApp,
  resetPasswordApp,
  signInAppFacebook,
  loyaltyHistoryList,
};
