const logger = require('../../../../utils/commonUtils/logger').adminLogger;
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../../utils/commonUtil');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const cartService = require('./cart.service');

const moduleName = 'cart';

const view = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const result = await cartService.view(moduleName, req.params, logger);
    if (result && !result.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(result.message, result.data));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
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
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Something went wrong, please try again later. Error:: ${error}`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const list = async (req, res) => {
  logger.verbose(`Handling  ${req.method} ${req.url} Route`);
  try {
    const data = await cartService.list(moduleName, req.params, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.carts));
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
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Something went wrong, please try again later. Error:: ${error}`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const search = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await cartService.search(moduleName, req.params, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.carts));
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
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Something went wrong, please try again later. Error:: ${error}`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

module.exports = {
  list,
  search,
  view,
};
