const Controller = require('./projects.controller');
const Swagger = require('./projects.swagger');

// TODO: JWT middle
const ProjectRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, Controller.list);
  fastify.get('/listLov', Swagger.listLov, Controller.listLov);
  done();
};

module.exports = ProjectRoutes;
