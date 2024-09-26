const Controller = require('./provider.controller');
const Swagger = require('./provider.swagger');
// TODO: JWT middle
const providerRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant/:page/:size', Swagger.list, Controller.list);
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    Swagger.search,
    Controller.search
  );
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post('/update/:id', Swagger.update, Controller.update);
  fastify.post(
    '/update/status/:id',
    Swagger.updateStatus,
    Controller.updateStatus
  );
  fastify.post('/delete/:id', Swagger.del, Controller.del);
  fastify.get('/edit/:id', Swagger.find, Controller.find);
  fastify.get('/find/:providerId', Swagger.findAppointmentByProviderId, Controller.findAppointmentByProviderId);

  fastify.get(
    '/schedule/list/:providerId',
    Swagger.scheduleList,
    Controller.scheduleList
  );

  fastify.post(
    '/schedule/create',
    Swagger.scheduleCreate,
    Controller.scheduleCreate
  );

  fastify.get(
    '/schedule/edit/:scheduleId',
    Swagger.scheduleFind,
    Controller.scheduleFind
  );

  fastify.post(
    '/schedule/update',
    Swagger.scheduleUpdate,
    Controller.scheduleUpdate
  );

  fastify.post(
    '/schedule/update/status',
    Swagger.scheduleUpdateStatus,
    Controller.scheduleUpdateStatus
  );

  done();
};

module.exports = providerRoutes;
