const Controller = require('./projectPlans.controller');
const Swagger = require('./projectPlans.swagger');

// TODO: JWT middle
const PlansRoutes = (fastify, options, done) => {
  fastify.get('/list/:projectId', Swagger.list, Controller.List);
  fastify.get('/listLov/:projectId', Swagger.listLOV, Controller.listLOV);

  done();
};

module.exports = PlansRoutes;
