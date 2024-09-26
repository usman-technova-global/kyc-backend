const logger = require('../../../utils/commonUtils/logger').adminLogger;
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../utils/commonUtil');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const MODULE = require('../../../utils/constants/moduleNames');

const Service = require('./wallet.service');

const moduleName = 'Wallet';
const list = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.list(moduleName, uriParams, logger);
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
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.create(moduleName, uriParams, req.body, logger);
    // console.log('data', data);
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

const updateWallet = async (req, res) => {
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.updateWallet(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    // console.log('data', data);
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

const transactions = async (req, res) => {
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.transactions(uriParams, logger);
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
      `Error in calling ${MODULE.ADMIN.VOUCHER_HISTORY} list service.
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
  create,
  updateWallet,
  transactions,
};
