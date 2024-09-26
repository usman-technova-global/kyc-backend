const logger = require('../../../../utils/commonUtils/logger').adminLogger;
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../../utils/commonUtil');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const dashboardService = require('./dashboard.service');

const moduleName = 'Dashboard';

const detail = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const result = await dashboardService.detail(
      moduleName,
      req.params.tenantId,
      logger
    );
    if (result && !result.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(result.message, result.item.data));
    }
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(result.message, {}, result.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} findById service.
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

module.exports = {
  detail,
};
