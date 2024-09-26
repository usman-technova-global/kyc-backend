const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appUserDeviceService = require('./appUserDevice.service');
const {
  apiFailResponse,
  apiSuccessResponse,
} = require('../../../utils/commonUtil');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { toCamelCase } = require('../../../utils/commonUtils/caseConversion');

async function registerDevice(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = toCamelCase(uriParams);
  try {
    const data = await appUserDeviceService.registerDevice(uriParams, req.body);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.user));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${MODULE.APP.USER_DEVICE} create service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
}

module.exports = {
  registerDevice,
};
