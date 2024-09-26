const pushNotificationRoute = require('./pushNotification/pushNotification.routes');
// TODO: JWT middle
const notificationRoutes = (fastify, options, done) => {
  fastify.register(pushNotificationRoute, { prefix: '/' });
  done();
};

module.exports = notificationRoutes;
