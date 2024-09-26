const visitRoutes = require('./visit/visit.routes');
const providerRoutes = require('./provider/provider.routes');
const serviceRoutes = require('./service/service.routes');
// TODO: JWT middle
const appointmentRoutes = (fastify, options, done) => {
  fastify.register(visitRoutes, { prefix: '/visit' });
  fastify.register(providerRoutes, { prefix: '/provider' });
  fastify.register(serviceRoutes, { prefix: '/service' });
  done();
};

module.exports = appointmentRoutes;
