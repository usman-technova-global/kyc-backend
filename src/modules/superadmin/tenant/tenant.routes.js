const tenantController = require('./tenant.controller');
const tenantSwagger = require('./tenant.swagger');
const shopRoutes = require('./shop/shop.routes');
const userRoutes = require('./user/user.routes');
// TODO: JWT middle
const tenantRoutes = (fastify, options, done) => {
  fastify.register(shopRoutes, { prefix: '/shop' });
  fastify.register(userRoutes, { prefix: '/user' });
  fastify.post('/create', tenantSwagger.create, tenantController.create);
  fastify.get('/view/:tenantId', tenantSwagger.view, tenantController.view);
  fastify.get('/list', tenantSwagger.list, tenantController.list);
  done();
};

module.exports = tenantRoutes;
