const orderController = require('./order.controller');
const Swagger = require('./order.swagger');
// TODO: JWT middle
const orderRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant/:page/:size', Swagger.list, orderController.list);
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    Swagger.search,
    orderController.search
  );
  fastify.get('/view/:orderId', Swagger.view, orderController.view);
  fastify.get(
    '/get/items/:orderId',
    Swagger.getItems,
    orderController.getItems
  );
  fastify.get(
    '/history/:orderId',
    Swagger.orderHistory,
    orderController.orderHistory
  );
  done();
};

module.exports = orderRoutes;
