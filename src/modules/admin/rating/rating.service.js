const Model = require('./rating.model');
const homeMenuModel = require('../../app/homeMenu/homeMenu.model');
const superAdminRatingModel = require('../../superadmin/rating/rating.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (moduleName, param, query, logger) => {
  const result = {
    hasError: false,
    items: { list: [], total: 0 },
  };
  let uriParams = {
    ...param,
    ...query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const findList = await Model.list(uriParams);
    if (findList) {
      result.items.list = findList.totalList;
      result.items.total = parseInt(findList.total, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const reviews = async (moduleName, param, query, logger) => {
  const result = {
    hasError: false,
    items: { list: [], total: 0 },
  };
  let uriParams = {
    ...param,
    ...query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const findList = await superAdminRatingModel.reviews(uriParams);
    if (findList) {
      result.items.list = findList.totalList;
      result.items.total = parseInt(findList.total, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};
const detailHomeCatItem = async (moduleName, param, logger) => {
  const result = { hasError: false };
  let uriParams = {
    ...param,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const [findResult] = await homeMenuModel.detailHomeCatItem(
      uriParams.homeCatItem
    );
    if (findResult) {
      result.item = findResult;
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};
const getDistinctStars = async (moduleName, param, logger) => {
  const result = {
    hasError: false,
    items: { list: [], total: 0 },
  };
  let uriParams = {
    ...param,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const findList = await superAdminRatingModel.getDistinctStars(uriParams);
    if (findList) {
      result.items.list = findList.starList;
      result.items.total = parseInt(findList.totalStars, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
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
  list,
  reviews,
  getDistinctStars,
  detailHomeCatItem,
};
