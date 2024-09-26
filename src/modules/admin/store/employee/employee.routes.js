const Controller = require('./employee.controller');
const Swagger = require('./employee.swagger');
// TODO: JWT middle
const employeeRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, Controller.list);
  fastify.get('/list/all', Swagger.list, Controller.employeeList);
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.get('/find/:employeeId', Swagger.find, Controller.find);
  fastify.post('/update/:employeeId', Swagger.update, Controller.update);
  fastify.post(
    '/update/status/:employeeId',
    Swagger.updateStatus,
    Controller.updateStatus
  );
  fastify.post(
    '/delete/:employeeId',
    Swagger.delete,
    Controller.employeeDelete
  );

  fastify.get(
    '/service/list/:employeeId',
    Swagger.employeeServiceList,
    Controller.employeeServiceList
  );

  fastify.post(
    '/service/create/:employeeId',
    Swagger.employeeServiceCreate,
    Controller.employeeServiceCreate
  );

  fastify.post(
    '/service/update/:serviceId',
    Swagger.employeeServiceUpdate,
    Controller.employeeServiceUpdate
  );

  fastify.post(
    '/service/update/status/:serviceId',
    Swagger.employeeServiceUpdateStatus,
    Controller.employeeServiceUpdateStatus
  );

  fastify.post(
    '/service/delete/:serviceId',
    Swagger.employeeServiceDelete,
    Controller.employeeServiceDelete
  );

  fastify.get(
    '/service/lov/:employeeId',
    Swagger.employeeServiceLov,
    Controller.employeeServiceLov
  );

  fastify.get('/lov', Swagger.employeeLov, Controller.employeeLov);

  fastify.get(
    '/schedule/list/:employeeId',
    Swagger.employeeScheduleList,
    Controller.employeeScheduleList
  );

  fastify.post(
    '/schedule/create/:employeeId',
    Swagger.employeeScheduleCreate,
    Controller.employeeScheduleCreate
  );

  fastify.post(
    '/schedule/update/:scheduleId',
    Swagger.employeeScheduleUpdate,
    Controller.employeeScheduleUpdate
  );

  fastify.post(
    '/schedule/update/status/:scheduleId',
    Swagger.employeeScheduleUpdateStatus,
    Controller.employeeScheduleUpdateStatus
  );

  fastify.get(
    '/attendance/:employeeId/:date',
    Swagger.attendanceList,
    Controller.attendanceList
  );

  fastify.get('/leave/management', Swagger.leave, Controller.leave);

  fastify.get(
    '/leave/management/:employeeId/:date',
    Swagger.leaveManagement,
    Controller.leaveManagement
  );

  fastify.post(
    '/leave/management/status/update/:storeEmployeeLeave',
    Swagger.leaveManagementUpdateStatus,
    Controller.leaveManagementUpdateStatus
  );

  fastify.get('/detail/:employeeId', Swagger.detail, Controller.detail);

  fastify.get(
    '/rating/reviews/:employeeId',
    Swagger.reviews,
    Controller.reviews
  );

  fastify.get(
    '/rating/distinct/star/list/:employeeId',
    Swagger.distinctStarList,
    Controller.distinctStarList
  );

  fastify.get('/expense/list', Swagger.expenseList, Controller.expenseList);

  fastify.post(
    '/expense/create',
    Swagger.expenseCreate,
    Controller.expenseCreate
  );

  done();
};

module.exports = employeeRoutes;
