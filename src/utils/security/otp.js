const { hashAsync, isVerifyAsync } = require('./bcrypt');
const { HOUR_IN_MS, HOUR } = require('../constants/timeConstants');
const {
  setValueWithExpiry,
  getValue,
  removeValue,
} = require('../../config/redisClient');

const OPT_KEY = (key) => `OTP_KEY:${key}`;

async function getOTP(email) {
  const OTP = Math.floor(1000 + Math.random() * 9000).toString();
  const object = {
    hashedOTP: await hashAsync(OTP),
    expiresAt: Date.now() + HOUR_IN_MS,
  };
  await setValueWithExpiry(
    'NO_TENANT_FOR_OTP',
    OPT_KEY(email),
    HOUR,
    JSON.stringify(object)
  );
  return OTP;
}

async function verifyOTP(email, otp) {
  const OTP = JSON.parse(await getValue('NO_TENANT_FOR_OTP', OPT_KEY(email)));
  if (!OTP || OTP.expiresAt < Date.now()) {
    return false;
  }
  return isVerifyAsync(otp, OTP.hashedOTP);
}

async function removeOTP(email) {
  await removeValue('NO_TENANT_FOR_OTP', OPT_KEY(email));
}

module.exports = {
  getOTP,
  verifyOTP,
  removeOTP,
};
