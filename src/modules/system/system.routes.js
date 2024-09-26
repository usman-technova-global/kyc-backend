const Controller = require('./system.controller');
const Swagger = require('./system.swagger');
// TODO: JWT middle
const systemConfigRoutes = (fastify, options, done) => {
  fastify.get('/get/:tenant', Swagger.get, Controller.get);
  fastify.get('/get/theme/:domain', Swagger.getDomain, Controller.getDomain);
  fastify.get(
    '/get/default/theme',
    Swagger.defaultTheme,
    Controller.defaultTheme
  );
  fastify.get('/detail/:tenant', Swagger.detail, Controller.detail);
  fastify.post(
    '/color/change/:tenant',
    Swagger.colorChange,
    Controller.colorChange
  );

  fastify.post(
    '/layout/update/:tenant',
    Swagger.layoutUpdate,
    Controller.layoutUpdate
  );

  done();
};

module.exports = systemConfigRoutes;
