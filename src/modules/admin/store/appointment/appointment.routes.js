const Controller = require('./appointment.controller');
const Swagger = require('./appointment.swagger');
// TODO: JWT middle
const appointmentRoutes = (fastify, options, done) => {
  fastify.get('/weekly/:week', Swagger.weekly, Controller.weekly);
  fastify.get(
    '/distinct/weekly/:week',
    Swagger.distinctWeekly,
    Controller.distinctWeekly
  );
  fastify.get(
    '/weekly/:storeEmployee/:week',
    Swagger.weekly,
    Controller.weeklyIndividual
  );
  fastify.get('/monthly/:month', Swagger.monthly, Controller.monthly);
  fastify.get(
    '/distinct/monthly/:month',
    Swagger.distinctMonthly,
    Controller.distinctMonthly
  );
  fastify.get(
    '/monthly/:storeEmployee/:month',
    Swagger.monthly,
    Controller.monthlyIndividual
  );
  fastify.get(
    '/get/:storeAppointment',
    Swagger.getAppointment,
    Controller.getAppointment
  );
  fastify.get(
    '/get/byCode/:code',
    Swagger.getAppointmentByCode,
    Controller.getAppointmentByCode
  );
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
  fastify.post(
    '/re-schedule/individual/:storeAppointment',
    Swagger.individualReSchedule,
    Controller.individualReSchedule
  );
  fastify.post('/re-schedule/:code', Swagger.reSchedule, Controller.reSchedule);
  fastify.post('/update/:storeAppointment', Swagger.update, Controller.update);
  fastify.post(
    '/update/status/:storeAppointment',
    Swagger.updateStatus,
    Controller.updateStatus
  );

  fastify.get(
    '/service/detail/:storeEmployee/:storeServiceCategoryItem',
    Swagger.serviceDetail,
    Controller.serviceDetail
  );

  fastify.patch(
    '/service/done/:storeAppointment',
    Swagger.serviceDone,
    Controller.serviceDone
  );

  fastify.patch(
    '/service/paid/:code',
    Swagger.servicePaid,
    Controller.servicePaid
  );

  fastify.patch(
    '/service/cancelled/all/:code',
    Swagger.allServicesCancell,
    Controller.allServicesCancell
  );

  fastify.patch(
    '/service/cancelled/:storeAppointment',
    Swagger.serviceCancell,
    Controller.serviceCancell
  );

  fastify.post(
    '/service/processing/:storeAppointment',
    Swagger.serviceProcessing,
    Controller.serviceProcessing
  );

  fastify.get(
    '/list/:tenant',
    Swagger.allAppointments,
    Controller.getAppointmentList
  );

  fastify.get(
    '/invoice/:code',
    Swagger.appointmentInvoice,
    Controller.appointmentInvoice
  );
  // fastify.get(
  //   '/invoice/done/:storeAppointment',
  //   Swagger.appointmentInvoiceByStatusDone,
  //   Controller.appointmentInvoiceByStatusDone
  // );

  done();
};

module.exports = appointmentRoutes;
