const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');

const appOrderDeliveryService = require('./appOrderDelivery.service');
const {
  apiFailResponse,
  apiSuccessResponse,
} = require('../../../utils/commonUtil');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function assignedOrders(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderDeliveryService.assignedOrders({
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
        .send(apiSuccessResponse(data.message, data.data));
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
      `Error in calling ${MODULE.APP.ORDER_DELIVERY} get assigned orders.
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

async function assignedOrderDetails(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderDeliveryService.assignedOrderDetails({
      appUser: req.session.userId,
      tenant: req.session.tenantId,
      orderId: req.params.orderId,
    });
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.data));
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
      `Error in calling ${MODULE.APP.ORDER_DELIVERY} get assigned orders.
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

async function setOrderStatus(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderDeliveryService.setOrderStatus({
      ...req.body,
      appUser: req.session.userId,
      tenant: req.session.tenantId,
    });
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.data));
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
      `Error in calling ${MODULE.APP.ORDER_DELIVERY} get assigned orders.
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
  assignedOrders,
  setOrderStatus,
  assignedOrderDetails,
};
