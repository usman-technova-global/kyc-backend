const Controller = require('./products.controller');
const Swagger = require('./products.swagger');

// TODO: JWT middle
const PlansRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenantId', Swagger.list, Controller.List);
  fastify.post('/create', Swagger.create, Controller.create);

  done();
};

module.exports = PlansRoutes;
