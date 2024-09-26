const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const appOrderService = require('./appOrder.service');
const {
  apiFailResponse,
  apiSuccessResponse,
} = require('../../../utils/commonUtil');
const stripe = require('../../../utils/paymentGateway/stripe');
const { toSnakeCase } = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function getList(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderService.getList({
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
      `Error in calling ${MODULE.APP.ORDER} order list.
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

async function getOrderDetail(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderService.getOrderDetail({
      id: req.params.id,
      appUser: req.session.userId,
      tenant: req.session.tenantId,
    });
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
      `Error in calling ${MODULE.APP.ORDER} order detail.
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

async function getOrderList(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderService.getOrderList({
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
      `Error in calling ${MODULE.APP.ORDER} order list.
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

async function newOrder(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderService.newOrder({
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
      `Error in calling ${MODULE.APP.ORDER} new order.
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

async function newOrderCash(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderService.newOrderCash({
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
      `Error in calling ${MODULE.APP.ORDER} new order.
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

async function newOrderPayFast(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await appOrderService.newOrderPayFast({
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
      `Error in calling ${MODULE.APP.ORDER} new order.
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

async function orderStatusUpdate(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  const endpointSecret = process.env.STRIPE_END_POINT_SECRET;
  const signature = req.headers['stripe-signature'];
  try {
    const event = await stripe.webhooks.constructEvent(
      req.body.raw,
      signature,
      endpointSecret
    );
    await appOrderService.storeStripeLogs(event);
    if (event.type === 'checkout.session.completed') {
      await appOrderService.orderStatusUpdate(event.data.object.id);
    }
    logger.verbose(
      `Handling Completed With Success On ${req.method} ${req.url} Route`
    );
    return res.status(HTTP_STATUS.OK).send();
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Stripe Webhook Error:: ${error.message}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(`Stripe Webhook Error: ${error.message}`);
  }
}

async function orderStatusUpdatePayFast(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  const payload = toSnakeCase(req.body);
  try {
    await appOrderService.storePayFastLogs(payload);
    if (payload.err_msg === 'SUCCESS') {
      await appOrderService.orderStatusUpdatePayFast(payload.basket_id);
    }
    logger.verbose(
      `Handling Completed With Success On ${req.method} ${req.url} Route`
    );
    return res.status(HTTP_STATUS.OK).send();
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Payfast Webhook Error:: ${error.message}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(`Payfast Webhook Error: ${error.message}`);
  }
}

async function getPayfastAccessToken(req, res) {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const result = await appOrderService.getPayfastAccessToken();
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
      `Payfast Get Access Token Error:: ${error.message}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send(`Payfast Get Access Token Error: ${error.message}`);
  }
}

module.exports = {
  getOrderList,
  newOrder,
  orderStatusUpdate,
  getList,
  getOrderDetail,
  orderStatusUpdatePayFast,
  getPayfastAccessToken,
  newOrderPayFast,
  newOrderCash,
};
