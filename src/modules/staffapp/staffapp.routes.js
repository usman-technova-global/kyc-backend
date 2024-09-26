const secureStaffAppRoutes = require('../../utils/security/secureStaffAppRoutes');
const appointmentRoutes = require('./appointment/appointment.routes');
const employeeRoutes = require('./employee/employee.routes');
// TODO: JWT middle
const staffappRoutes = (fastify, options, done) => {
  secureStaffAppRoutes.secureStaffApp(fastify);
  fastify.register(appointmentRoutes, { prefix: '/appointment' });
  fastify.register(employeeRoutes, { prefix: '/employee' });

  done();
};

module.exports = staffappRoutes;
