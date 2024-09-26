const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appUserDeviceModel = require('./appUserDevice.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function registerDevice(uriParams, userData) {
  let newUserData = userData;
  let appUser = { hasError: false };
  try {
    newUserData = toSnakeCase(newUserData);
    const userResult = await appUserDeviceModel.registerDevice(
      uriParams,
      newUserData
    );
    if (userResult) {
      appUser = { ...appUser, user: userResult };
      appUser.message = `your device has been registered successfully.`;
    } else {
      appUser.hasError = true;
      appUser.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appUser.message = `Unable to register your device, please check the payload.`;
      logger.error(
        `Unable to register ${MODULE.APP.USER_DEVICE}.
        Payload:: ${prettyPrintJSON(newUserData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to register ${MODULE.APP.USER_DEVICE}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newUserData)}`
    );
    appUser.hasError = true;
    appUser.message = error.detail;
    appUser.code = error.code;
  }
  return toCamelCase(appUser);
}

module.exports = {
  registerDevice,
};
