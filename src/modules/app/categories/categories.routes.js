const Controller = require('./categories.controller');
const Swagger = require('./categories.swagger');
// TODO: JWT middle
const serviceRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant', Swagger.categoryList, Controller.categoryList);

  done();
};

module.exports = serviceRoutes;
