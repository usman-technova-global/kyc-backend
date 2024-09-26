const Controller = require('./categoriesItem.controller');
const Swagger = require('./categoriesItem.swagger');
// TODO: JWT middle
const serviceRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenant',
    Swagger.categoryItemList,
    Controller.categoryItemList
  );

  done();
};

module.exports = serviceRoutes;
