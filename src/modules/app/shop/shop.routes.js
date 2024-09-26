const shopController = require('./shop.controller');
const shopSwagger = require('./shop.swagger');

const shopRoutes = (fastify, options, done) => {
  fastify.get('/view/:tenant', shopSwagger.viewShop, shopController.view);
  done();
};

module.exports = shopRoutes;
