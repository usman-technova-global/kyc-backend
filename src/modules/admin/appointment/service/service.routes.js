const Controller = require('./service.controller');
const Swagger = require('./service.swagger');
// TODO: JWT middle
const serviceRoutes = (fastify, options, done) => {
  fastify.get('/list/:providerId/:page/:size', Swagger.list, Controller.list);
  fastify.get(
    '/list/:providerId/:search/:page/:size',
    Swagger.search,
    Controller.search
  );
  fastify.get(
    '/lov/provider/:tenant',
    Swagger.lovProvider,
    Controller.lovProvider
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

  done();
};

module.exports = serviceRoutes;
