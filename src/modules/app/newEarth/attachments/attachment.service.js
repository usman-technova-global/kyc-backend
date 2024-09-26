const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');

const Model = require('./attachment.model');

const attachmentList = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.attachmentListService(uriParams);
    if (findResult) {
      result.items.total = parseInt(findResult.total, 10);
      result.items.list = findResult.totalList;
      result = { ...result };
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
  attachmentList,
};
