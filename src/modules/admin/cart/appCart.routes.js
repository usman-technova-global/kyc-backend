const cartRoutes = require('./appCart/cart.routes');
// TODO: JWT middle
const appCartRoutes = (fastify, options, done) => {
  fastify.register(cartRoutes, { prefix: '/' });
  done();
};

module.exports = appCartRoutes;
