const Controller = require('./appointment.controller');
const Swagger = require('./appointment.swagger');
// TODO: JWT middle
const appointmentRoutes = (fastify, options, done) => {
  fastify.get('/list/:date', Swagger.list, Controller.list);
  fastify.get('/today', Swagger.today, Controller.today);
  fastify.post('/done/:storeAppointment', Swagger.done, Controller.done);

  done();
};

module.exports = appointmentRoutes;
