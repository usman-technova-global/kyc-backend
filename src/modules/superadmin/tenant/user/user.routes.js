const userController = require('./user.controller');
const Swagger = require('./user.swagger');
// TODO: JWT middle
const userRoutes = (fastify, options, done) => {
  fastify.get('/list/:page/:size', Swagger.list, userController.list);
  fastify.get(
    '/list/:search/:page/:size',
    Swagger.search,
    userController.search
  );
  fastify.get('/detail/:userId', Swagger.detail, userController.detail);

  done();
};

module.exports = userRoutes;
