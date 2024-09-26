const { index, gerBarbersAppointment } = require('./barber.controller');
const swagger = require('./barber.swagger');

// TODO: JWT middle
const barberRoutes = (fastify, options, done) => {
  fastify.post('/barbers', swagger.employeeLov, index);
  fastify.post('/barbers/appointments', swagger.linedUp, gerBarbersAppointment);
  done();
};

module.exports = barberRoutes;
