const appNotificationController = require('./appNotification.controller');
const appNotificationSwagger = require('./appNotification.swagger');

const appNotificationRoutes = (fastify, options, done) => {
  fastify.get(
    '/list',
    appNotificationSwagger.getNotification,
    appNotificationController.list
  );
  done();
};

module.exports = appNotificationRoutes;
