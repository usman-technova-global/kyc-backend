const Controller = require('./projectPlans.controller');
const Swagger = require('./projectPlans.swagger');

// TODO: JWT middle
const PlansRoutes = (fastify, options, done) => {
  fastify.post(
    '/uploadFile/:tenantId',
    Swagger.uploadFile,
    Controller.uploadFile
  );
  fastify.post(
    '/update/:tenantId',
    Swagger.updatePlans,
    Controller.updatePlans
  );
  fastify.get('/list/:projectId/:tenantId', Swagger.list, Controller.List);
  fastify.get('/listLov/:projectId', Swagger.listLOV, Controller.listLOV);

  done();
};

module.exports = PlansRoutes;
