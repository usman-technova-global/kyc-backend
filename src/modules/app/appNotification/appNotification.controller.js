const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../utils/commonUtil');
const appNotificationService = require('./appNotification.service');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function list(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appNotificationService.findByUserIdAndTenantId({
      appUser: req.session.userId,
      tenant: req.session.tenantId,
      ...req.query,
    });
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.notifications));
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
      `Error in calling ${MODULE.APP.NOTIFICATION} findByTenantId service.
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

module.exports = { list };
