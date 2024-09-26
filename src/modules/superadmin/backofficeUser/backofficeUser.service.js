const { v4: uuidv4 } = require('uuid');
const backOfficeUserModel = require('./backofficeUser.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const { getValue, removeValue } = require('../../../config/redisClient');
const { isVerifyAsync } = require('../../../utils/security/bcrypt');
const JwtAuth = require('../../../utils/security/oauth');
const {
  getAuthTokensForAdmin,
  /* generateRefreshToken, */
} = require('../../../utils/security/oauth');

const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const uploader = require('../../../utils/s3Uploader/s3Uploader');

const login = async (moduleName, userData, logger) => {
  const result = { hasError: false };
  try {
    const tempUsers = await backOfficeUserModel.findUserByEmail(
      userData.username,
      logger
    );
    if (tempUsers && tempUsers.length > 0) {
      const tempUser = tempUsers[0];
  //    if (tempUser.is_super_admin) {
        const passwordResult = await isVerifyAsync(
          userData.password,
          tempUser.password
        );

        if (passwordResult) {
          delete tempUser.password;
          const [accessToken, refreshNewToken] = await getAuthTokensForAdmin(
            { userId: tempUser.id, email: tempUser.username, role:tempUser.role  },
            process.env.SUPER_ADMIN_SECRET_KEY
          );

          tempUser.access_token = accessToken;
          tempUser.refresh_token = refreshNewToken;
          result.user = tempUser;
          result.role = tempUser.role
          result.message = `${moduleName} has been fetched successfully.`;
          result.code = HTTP_STATUS.OK;
        } else {
          result.hasError = true;
          result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          result.message = `There is an error in sign-in, please check the username and password.`;
          logger.error(`${moduleName} user does not found.`);
        }
      // } else {
      //   result.hasError = true;
      //   result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      //   result.message = `Only super admin account is allowed.`;
      //   logger.error(`${moduleName} Only super admin account is allowed.`);
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

const refreshToken = async (headers, logger) => {
  const result = { hasError: false };
  try {
    const token = headers.authorization;
    if (!process.env.SUPER_ADMIN_SECRET_KEY) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Domain not found`;
      logger.error(`Domain not found`);
      return caseConversion.toCamelCase(result);
    }
    const storeToken = await getValue(
      process.env.SUPER_ADMIN_SECRET_KEY,
      token
    );

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
      process.env.SUPER_ADMIN_SECRET_KEY
    );
    await removeValue(process.env.SUPER_ADMIN_SECRET_KEY, token);

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

module.exports = {
  profile,
  profileUpdate,
  login,
  refreshToken,
};
