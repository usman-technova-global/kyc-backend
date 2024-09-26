const Controller = require('./projects.controller');
const Swagger = require('./projects.swagger');

// TODO: JWT middle
const ProjectRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenantId', Swagger.list, Controller.list);
  fastify.get('/listLov/:tenantId', Swagger.listLov, Controller.listLov);
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post('/update/:projectId', Swagger.update, Controller.update);
  fastify.post(
    '/update/status/:projectId',
    Swagger.updateStatus,
    Controller.updateStatus
  );
  fastify.post('/delete/:projectId', Swagger.delete, Controller.deleteStatus);
  done();
};

module.exports = ProjectRoutes;
