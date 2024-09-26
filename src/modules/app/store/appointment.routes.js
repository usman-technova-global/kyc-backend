const Controller = require('../../admin/store/appointment/appointment.controller');
const Swagger = require('./appointment.swagger');
const barberRoutes = require('./employess/barber.routes');
// TODO: JWT middle
const appointmentRoutes = (fastify, options, done) => {
  fastify.get(
    '/employee/:storeServiceCategoryItem',
    Swagger.employeeLov,
    Controller.employeeLov
  );
  fastify.get(
    '/linedUp/:storeEmployee/:linedUpDate',
    Swagger.linedUp,
    Controller.linedUp
  );

  fastify.post('/create', Swagger.create, Controller.create);

  fastify.post('/peng/create', Swagger.pengCreate, Controller.pengCreate);

  fastify.get(
    '/list/:tenant',
    Swagger.allAppointments,
    Controller.getAppointmentList
  );

  fastify.get(
    '/get/:storeAppointment',
    Swagger.getAppointment,
    Controller.getAppointment
  );

  fastify.post(
    '/re-schedule/:storeAppointment',
    Swagger.reSchedule,
    Controller.reSchedule
  );

  fastify.register(barberRoutes);

  done();
};

module.exports = appointmentRoutes;
