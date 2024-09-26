const themeController = require('./tenantConfig.controller');
// TODO: JWT middle
const themeRoutes = (fastify, options, done) => {
  fastify.post('/create', themeController.create);
  fastify.get('/view/:themeId', themeController.view);
  fastify.get('/list', themeController.list);
  done();
};

module.exports = themeRoutes;
