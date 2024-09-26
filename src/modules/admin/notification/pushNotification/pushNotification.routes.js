const Swagger = require('./pushNotification.swagger');
const pushNotificationController = require('./pushNotification.controller');
// TODO: JWT middle
const pushNotificationRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenant/:page/:size',
    Swagger.list,
    pushNotificationController.list
  );
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    Swagger.search,
    pushNotificationController.search
  );
  fastify.get(
    '/batch/detail/:id',
    Swagger.batchDetail,
    pushNotificationController.batchDetail
  );
  fastify.post('/sent', Swagger.sent, pushNotificationController.sent);
  done();
};

module.exports = pushNotificationRoutes;
