const appOrderDeliveryController = require('./appOrderDelivery.controller');
const appOrderDeliverySwagger = require('./appOrderDelivery.swagger');

function appOrderDeliveryRoutes(fastify, options, done) {
  fastify.get(
    '/assignedOrders',
    appOrderDeliverySwagger.assignedOrders,
    appOrderDeliveryController.assignedOrders
  );

  fastify.get(
    '/assignedOrders/:orderId',
    appOrderDeliverySwagger.assignedOrderDetails,
    appOrderDeliveryController.assignedOrderDetails
  );

  fastify.post(
    '/setOrderStatus',
    appOrderDeliverySwagger.setOrderStatus,
    appOrderDeliveryController.setOrderStatus
  );

  done();
}

module.exports = appOrderDeliveryRoutes;
