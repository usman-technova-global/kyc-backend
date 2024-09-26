const shopScheduleController = require('./shopScheduling.controller');
const Swagger = require('./shopEventHoliday.swagger');
// TODO: JWT middle
const shopScheduleRoutes = (fastify, options, done) => {
  fastify.get('/get/:tenant/:date', Swagger.get, shopScheduleController.get);

  fastify.post(
    '/setSchedule/:tenant',
    Swagger.update,
    shopScheduleController.SetSchedule
  );
  done();
};

module.exports = shopScheduleRoutes;
