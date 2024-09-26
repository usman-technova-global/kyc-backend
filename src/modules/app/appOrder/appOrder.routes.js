const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const appOrderController = require('./appOrder.controller');
const appOrderSwagger = require('./appOrder.swagger');
const orderStatusesRoutes = require('./appOrderStatuses/orderStatuses.routes');

function appOrderRoutes(fastify, options, done) {
  fastify.get(
    '/list',
    appOrderSwagger.getOrderList,
    appOrderController.getOrderList
  );

  fastify.get(
    '/webapp/list',
    appOrderSwagger.getList,
    appOrderController.getList
  );

  fastify.get(
    '/webapp/detail/:id',
    appOrderSwagger.orderDetail,
    appOrderController.getOrderDetail
  );

  fastify.post(
    '/newOrder',
    appOrderSwagger.newOrder,
    appOrderController.newOrder
  );
  fastify.post(
    '/newPayFastOrder',
    appOrderSwagger.newOrder,
    appOrderController.newOrderPayFast
  );
  fastify.post(
    '/newCashOrder',
    appOrderSwagger.newOrder,
    appOrderController.newOrderCash
  );

  fastify.post(
    '/pay-fast/access-token',
    appOrderSwagger.getPayfastAccessToken,
    appOrderController.getPayfastAccessToken
  );

  fastify.post(
    '/pay-fast/webhook',
    appOrderSwagger.orderStatusUpdate,
    appOrderController.orderStatusUpdatePayFast
  );

  fastify.register(orderStatusesRoutes, { prefix: '/statuses' });

  fastify.register((fastifyX, opts, doneX) => {
    fastifyX.addContentTypeParser(
      'application/json',
      { parseAs: 'buffer' },
      (req, body, doneACTP) => {
        try {
          const newBody = {
            raw: body,
          };
          doneACTP(null, newBody);
        } catch (error) {
          error.statuscode = HTTP_STATUS.BAD_REQUEST;
          doneACTP(error, undefined);
        }
      }
    );
    fastifyX.post(
      '/stripe/webhook',
      appOrderSwagger.orderStatusUpdate,
      appOrderController.orderStatusUpdate
    );

    doneX();
  });

  done();
}

module.exports = appOrderRoutes;
