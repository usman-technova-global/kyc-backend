const orderRoutes = require('./appOrder/order.routes');
const orderStatusesRoutes = require('./appOrderStatuses/orderStatuses.routes');
const orderAssignRoutes = require('./appOrderAssign/orderAssign.routes');
const orderPlaceRoutes = require('./orderPlace/orderPlace.routes');
// TODO: JWT middle
const appOrderRoutes = (fastify, options, done) => {
  fastify.register(orderPlaceRoutes, { prefix: '/place' });
  fastify.register(orderAssignRoutes, { prefix: '/assign' });
  fastify.register(orderStatusesRoutes, { prefix: '/statuses' });
  fastify.register(orderRoutes, { prefix: '/' });
  done();
};

module.exports = appOrderRoutes;
