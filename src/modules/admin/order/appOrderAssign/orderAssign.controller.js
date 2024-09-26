const logger = require('../../../../utils/commonUtils/logger').adminLogger;
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../../utils/commonUtil');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const orderAssignService = require('./orderAssign.service');

const moduleName = 'Order Assign';

const list = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await orderAssignService.list(moduleName, req.params, logger);
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
    const data = await orderAssignService.search(
      moduleName,
      req.params,
      logger
    );
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
      `Error in calling ${moduleName} list service.
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

const create = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await orderAssignService.create(
      moduleName,
      { ...req.body, created_by: req.session.userId },
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
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
      `Error in calling ${moduleName} create service.
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
  list,
  search,
  create,
};
