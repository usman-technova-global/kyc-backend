const { v4: uuidv4 } = require('uuid');
const orderStatusesModel = require('./orderStatuses.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const create = async (moduleName, orderStatusesData, logger) => {
  const newOrderStatusesData = orderStatusesData;
  let result = { hasError: false, order: {} };
  try {
    newOrderStatusesData.id = uuidv4();
    const orderResult = await orderStatusesModel.create(newOrderStatusesData);
    if (orderResult && Object.keys(orderResult).length > 0) {
      result = { ...result, order: orderResult };
      result.message = `${moduleName} has been created successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(newOrderStatusesData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
        Error:: ${error}
        Trace:: ${error.stack}
        Payload:: ${prettyPrintJSON(newOrderStatusesData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

module.exports = { create };
