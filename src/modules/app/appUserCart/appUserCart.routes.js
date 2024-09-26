const appUserCartController = require('./appUserCart.controller');
const appUserCartSwagger = require('./appUserCart.swagger');

function appUserCartRoutes(fastify, options, done) {
  fastify.post(
    '/getCart/user',
    appUserCartSwagger.getCartByUser,
    appUserCartController.getCartByUser
  );
  fastify.post(
    '/getCart/device',
    appUserCartSwagger.getCartByDevice,
    appUserCartController.getCartByDevice
  );
  fastify.post(
    '/updateCart',
    appUserCartSwagger.updateCart,
    appUserCartController.updateCart
  );
  done();
}

module.exports = appUserCartRoutes;
