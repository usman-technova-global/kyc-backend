const dashboardModel = require('./dashboard.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const detail = async (moduleName, id, logger) => {
  const result = { hasError: false };
  const currentDateTime = new Date();
  try {
    const findDetails = await dashboardModel.detail(
      id,
      currentDateTime,
      logger
    );
    if (findDetails) {
      result.item = { ...result, data: findDetails };
      result.code = HTTP_STATUS.OK;
      result.message = `${moduleName} count has been fetched successfully.`;
    } else {
      logger.error(
        `${moduleName} does not found.
        Id:: ${id}`
      );
      result.hasError = true;
      result.message = `does not found`;
      result.code = HTTP_STATUS.BAD_REQUEST;
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${id}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = { detail };
