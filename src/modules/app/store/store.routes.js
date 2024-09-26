const appointmentRoutes = require('./appointment.routes');

// TODO: JWT middle
const storeRoutes = (fastify, options, done) => {
  fastify.register(appointmentRoutes, { prefix: '/appointment' });
  done();
};

module.exports = storeRoutes;
