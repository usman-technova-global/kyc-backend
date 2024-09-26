const orderAssignController = require('./orderAssign.controller');
const Swagger = require('./orderAssign.swagger');
// TODO: JWT middle
const orderAssignRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenant/:page/:size',
    Swagger.list,
    orderAssignController.list
  );
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    Swagger.search,
    orderAssignController.search
  );
  fastify.post('/create', Swagger.create, orderAssignController.create);
  done();
};

module.exports = orderAssignRoutes;
