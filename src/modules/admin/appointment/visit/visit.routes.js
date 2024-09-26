const Controller = require('./visit.controller');
const Swagger = require('./visit.swagger');
// TODO: JWT middle
const visitRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant/:page/:size', Swagger.list, Controller.list);
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    Swagger.search,
    Controller.search
  );
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post('/reschedule', Swagger.reSchedule, Controller.reSchedule);
  fastify.get(
    '/lov/provider/:tenant',
    Swagger.lovProvider,
    Controller.lovProvider
  );
  fastify.get(
    '/lov/service/:providerId',
    Swagger.lovService,
    Controller.lovService
  );
  fastify.get('/edit/:appointmentId', Swagger.edit, Controller.edit);
  fastify.get('/provider/:providerId', Swagger.provider, Controller.provider);
  fastify.post('/update', Swagger.update, Controller.update);
  fastify.get('/cancel/:appointmentId', Swagger.cancel, Controller.cancel);
  fastify.get('/detail/:appointmentId', Swagger.detail, Controller.detail);

  done();
};

module.exports = visitRoutes;
