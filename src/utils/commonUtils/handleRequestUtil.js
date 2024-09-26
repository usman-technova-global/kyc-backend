const { apiSuccessResponse, apiFailResponse } = require('../commonUtil');
const HTTP_STATUS = require('../constants/httpStatus');

const handleRequest = async (serviceFunction, req, res, moduleName, logger) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await serviceFunction(req, res);

    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
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
      `Error in calling ${moduleName} service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .send(
        apiFailResponse(
          `Something went wrong, please try again later.`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

module.exports = handleRequest;
