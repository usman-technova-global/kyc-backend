const Controller = require('./appointment.controller');
const Swagger = require('./appointment.swagger');
// TODO: JWT middle
const visitRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, Controller.list);
  /* NEw Services */
  fastify.get('/service/categories', Swagger.categories, Controller.categories);
  fastify.get(
    '/service/category/:categoryId/items',
    Swagger.categoryItems,
    Controller.categoryItems
  );
  fastify.get(
    '/service/category/item/:categoryItemId',
    Swagger.serviceCategoryItem,
    Controller.serviceCategoryItem
  );
  fastify.get(
    '/service/provider/:categoryItemId',
    Swagger.serviceProviders,
    Controller.serviceProviders
  );

  fastify.get(
    '/linedUp/:storeEmployee/:linedUpDate',
    Swagger.linedUp,
    Controller.linedUp
  );

  fastify.post('/create', Swagger.create, Controller.create);

  fastify.post(
    '/re-schedule/:storeAppointment',
    Swagger.reSchedule,
    Controller.create
  );

  fastify.get('/rating/list', Swagger.ratinglist, Controller.ratinglist);

  fastify.post(
    '/rating/:storeEmployeeRating',
    Swagger.rating,
    Controller.rating
  );

  fastify.get(
    '/leave/management/:employeeId/:date',
    Swagger.leaveManagement,
    Controller.leaveManagement
  );

  fastify.post(
    '/leave/multi-employees/management/:date',
    Swagger.leaveManagementForEmployees,
    Controller.leaveManagementForEmployees
  );

  fastify.get(
    '/users/:date',
    Swagger.appointmentUsers,
    Controller.appointmentUsers
  );

  fastify.post(
    '/users/multi-dates',
    Swagger.userAppointmentsByDates,
    Controller.userAppointmentsByDates
  );

  fastify.post(
    '/pay-fast/access-token',
    Swagger.getPayfastAccessToken,
    Controller.getPayfastAccessToken
  );

  fastify.post(
    '/pay-fast/webhook',
    Swagger.orderStatusUpdate,
    Controller.orderStatusUpdatePayFast
  );

  done();
};

module.exports = visitRoutes;
