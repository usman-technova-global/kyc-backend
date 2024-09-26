const md5 = require('md5');
const jwt = require('jsonwebtoken');
const redisClient = require('../../config/redisClient');

const {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_SECRET_KEY_ADMIN,
  JWT_REFRESH_SECRET_KEY_ADMIN,
} = process.env;
const caseConversion = require('../commonUtils/caseConversion');

const decodeToken = (token) => jwt.decode(token);

const getExpiry = (expiryTime) => {
  const parsed = Number(expiryTime);
  if (Number.isNaN(parsed)) {
    return expiryTime;
  }
  return parseInt(expiryTime, 10);
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY);
    return { result: true, message: 'success', data: decoded.payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        result: false,
        message: 'Session expired, please login again to get the new token.',
      };
    }
    return {
      result: false,
      message: 'Invalid token, please login again to get the new token.',
    };
  }
};

const verifyTokenForAdmin = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET_KEY_ADMIN);
    return { result: true, message: 'success', data: decoded.payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        result: false,
        message: 'Session expired, please login again to get the new token.',
      };
    }
    return {
      result: false,
      message: 'Invalid token, please login again to get the new token.',
    };
  }
};

const verifyRefreshTokenForAdmin = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET_KEY_ADMIN);
    return { result: true, message: 'success', data: decoded.payload };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        result: false,
        message: 'Session expired, please login again to get the new token.',
      };
    }
    return {
      result: false,
      message: 'Invalid token, please login again to get the new token.',
    };
  }
};

const generateAccessToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET_KEY, {
    expiresIn: getExpiry(process.env.tokenExpire),
  });

const generateRefreshToken = (payload) =>
  jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: getExpiry(process.env.refreshTokenExpire),
  });

const generateAccessTokenForAdmin = (payload) =>
  jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET_KEY_ADMIN, {
    expiresIn: getExpiry(process.env.JWT_TOKEN_EXPIREY_ADMIN),
  });

const generateRefreshTokenForAdmin = (payload) =>
  jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET_KEY_ADMIN, {
    expiresIn: getExpiry(process.env.JWT_REFRESH_TOKEN_EXPIREY_ADMIN),
  });

const getAuthTokensForAdmin = async (payload, key) => {
  try {
    const accessToken = generateAccessTokenForAdmin(
      caseConversion.toCamelCase(payload)
    );

    const refreshToken = generateRefreshTokenForAdmin(
      caseConversion.toCamelCase(payload)
    );

    const shortAccessToken = md5(accessToken);
    const shortRefreshToken = md5(refreshToken);
    await redisClient.setValueWithExpiry(
      key,
      shortAccessToken,
      process.env.JWT_TOKEN_EXPIREY_ADMIN,
      accessToken
    );

    await redisClient.setValueWithExpiry(
      key,
      shortRefreshToken,
      process.env.JWT_REFRESH_TOKEN_EXPIREY_ADMIN,
      refreshToken
    );

    // const test1 = await redisClient.getValue(key, shortAccessToken);
    // const test2 = await redisClient.getValue(key, shortRefreshToken);
    // console.log('test1', test1);
    // console.log('test2', test2);
    return [shortAccessToken, shortRefreshToken];
  } catch (error) {
    // console.log('error', error);
    throw new Error(error);
  }
};

module.exports = {
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  verifyTokenForAdmin,
  decodeToken,
  getAuthTokensForAdmin,
  verifyRefreshTokenForAdmin,
};
