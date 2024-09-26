const Controller = require('./employee.controller');
const Swagger = require('./employee.swagger');
// TODO: JWT middle
const employeeRoutes = (fastify, options, done) => {
  fastify.post('/login', Swagger.login, Controller.login);
  fastify.post(
    '/register/device',
    Swagger.registerDevice,
    Controller.registerDevice
  );
  fastify.post(
    '/attendance/scan',
    Swagger.attendanceScan,
    Controller.attendanceScan
  );
  fastify.get(
    '/attendance/check',
    Swagger.attendanceCheck,
    Controller.attendanceCheck
  );
  fastify.get(
    '/attendance/weekly/:week',
    Swagger.attendanceWeekly,
    Controller.attendanceWeekly
  );

  fastify.get(
    '/leave/management',
    Swagger.leaveManagement,
    Controller.leaveManagement
  );

  fastify.post(
    '/leave/management/create',
    Swagger.leaveManagementCreate,
    Controller.leaveManagementCreate
  );

  fastify.get('/payroll/:date', Swagger.payroll, Controller.payroll);

  fastify.get('/profile', Swagger.profile, Controller.profile);

  fastify.get('/schedule', Swagger.schedule, Controller.schedule);

  fastify.post(
    '/change/profile/avatar',
    Swagger.changeProfileAvatar,
    Controller.changeProfileAvatar
  );

  fastify.post(
    '/forgotPassword',
    Swagger.forgotPasswordApp,
    Controller.forgotPassword
  );

  fastify.post(
    '/resetPassword',
    Swagger.resetPasswordApp,
    Controller.resetPassword
  );

  done();
};

module.exports = employeeRoutes;
