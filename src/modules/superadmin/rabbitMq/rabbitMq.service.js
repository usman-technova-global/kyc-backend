const caseConversion = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { NOTIFICATION } = require('../../../utils/constants/queseConstants');
const { sendToQueue } = require('../../../utils/queues/rabbmitMqConnection');

const send = async (data, logger) => {
  const result = { code: HTTP_STATUS.OK, message: '', data: {} };
  try {
    result.message = 'Success';
    const notification = {
      title: 'Macbook',
      message: 'This is a sample message to test notification.',
    };

    try {
      sendToQueue(NOTIFICATION, notification);
    } catch (error) {
      logger.error(error);
    }
  } catch (error) {
    result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    result.message = `something went wrong`;
    logger.error(
      `Unable to send notification.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(data)}`
    );
  }

  return caseConversion.toCamelCase(result);
};

module.exports = { send };
