/* eslint-disable default-param-last */
// const { setRandomFallback } = require('bcryptjs');
const knex = require('../config/databaseConnection');
const MODULE = require('./constants/moduleNames');
const HTTP_STATUS = require('./constants/httpStatus');
const generate = require('./random-four-letter-words');

const DOMAIN_PREFIX = 'urapptech.com';
const EMPLOYEE_ROLE_NAME = 'User';
const BRANCH_ROLE_NAME = 'BranchUser';
const DEFAULT = 'Default';

const SERVER_BASE_PATH = process.env.WEB_SERVER_BASEPATH;

const notNull = (value) => {
  if (!value) {
    return false;
  }
  return true;
};

const apiResponse = (code = HTTP_STATUS.OK, message, obj, success = true) => ({
  result: {
    success,
    code,
    message,
    data: obj,
  },
});
const apiSuccessResponse = (message, obj) => ({
  success: true,
  code: HTTP_STATUS.OK,
  message,
  data: obj,
});

const apiFailResponse = (message, obj, code = HTTP_STATUS.BAD_REQUEST) => ({
  success: false,
  code,
  message,
  data: obj,
});

const validationError = (res, validator) =>
  res
    .status(HTTP_STATUS.OK)
    .send(
      apiFailResponse(validator.errors[0].message, {}, HTTP_STATUS.BAD_REQUEST)
    );

function rowsToJson(tableName, columns = []) {
  if (columns.length) {
    const columnsFormat = columns
      .map((column) => `'${column}', ${tableName}."${column}"`)
      .join(', ');
    return `json_build_object(${columnsFormat}) ${tableName}`;
  }
  return `row_to_json(${tableName}.*) AS ${tableName}`;
}

function jsonBuildObject(tableName, columns = []) {
  if (columns.length) {
    const columnsFormat = columns
      .map((column) => `'${column}', ${tableName}."${column}"`)
      .join(', ');
    return `json_agg(json_build_object(${columnsFormat})) -> 0 AS ${tableName}`;
  }
  return `json_agg(${tableName}.*)-> 0 AS ${tableName}`;
}

function splitIntoEqualParts(input) {
  const inputString = String(input);
  if (inputString.length % 2 !== 0) {
    return [
      `0${inputString.slice(0, inputString.length / 2)}`,
      inputString.slice(inputString.length / 2),
    ];
  }
  const middleIndex = Math.floor(inputString.length / 2);
  return [inputString.slice(0, middleIndex), inputString.slice(middleIndex)];
}

const generateRandomString = () => {
  const [dateStart, dateEnd] = splitIntoEqualParts(Date.now());
  const randomWords = generate(4);
  return [dateStart, ...randomWords, dateEnd].join('_');
};

const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const earthRadius = 6371; // Earth's radius in meters
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) *
      Math.cos(degreesToRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceInMeters = earthRadius * c * 1000;

  return distanceInMeters;
};

const getTenantConfig = async (tenantId) => {
  const tenant = knex
    .select('tenant_config')
    .from(MODULE.TENANT)
    .where('id', tenantId);
  return knex(MODULE.TENANT_CONFIG)
    .whereRaw(`id = (${tenant.toString()})`)
    .first();
};

module.exports = {
  notNull,
  apiResponse,
  apiSuccessResponse,
  apiFailResponse,
  DOMAIN_PREFIX,
  EMPLOYEE_ROLE_NAME,
  SERVER_BASE_PATH,
  BRANCH_ROLE_NAME,
  DEFAULT,
  rowsToJson,
  jsonBuildObject,
  validationError,
  generateRandomString,
  calculateDistance,
  getTenantConfig,
};
