const cartController = require('./cart.controller');
const cartSwagger = require('./cart.swagger');

// TODO: JWT middle
const cartRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenant/:page/:size',
    cartSwagger.list,
    cartController.list
  );
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    cartSwagger.search,
    cartController.search
  );
  fastify.get('/view/:cartId', cartSwagger.view, cartController.view);

  done();
};

module.exports = cartRoutes;
