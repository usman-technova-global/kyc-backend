const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const appCustomerService = require('./appCustomer.service');
const {
  apiFailResponse,
  apiSuccessResponse,
} = require('../../../utils/commonUtil');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const createCustomer = async (req, res) => {
  // delete req.body.doc_front
  // delete req.body.image
  // delete req.body.tenant
  // console.log("customer--------- ", req.body);
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appCustomerService.createCustomer(req.body);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.customer));
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
      `Error in calling ${MODULE.APP.USER} create service.
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
  createCustomer,
};
