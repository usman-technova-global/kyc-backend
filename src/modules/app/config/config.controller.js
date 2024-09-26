const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../utils/commonUtil');
const configService = require('./config.service');
const MODULE = require('../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const view = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await configService.findByTenantId(req.params.tenantId);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.tenant));
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
      `Error in calling ${MODULE.TENANT_CONFIG} findByTenantId service.
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
};

module.exports = { view };
