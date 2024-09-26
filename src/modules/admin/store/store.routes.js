const employeeRoutes = require('./employee/employee.routes');
const serviceRoutes = require('./service/service.routes');
const appointmentRoutes = require('./appointment/appointment.routes');

// TODO: JWT middle
const storeRoutes = (fastify, options, done) => {
  fastify.register(employeeRoutes, { prefix: '/employee' });
  fastify.register(serviceRoutes, { prefix: '/service' });
  fastify.register(appointmentRoutes, { prefix: '/appointment' });
  done();
};

module.exports = storeRoutes;
