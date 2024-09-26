const dashboardController = require('./dashboard.controller');
const Swagger = require('./dashboard.swagger');
// TODO: JWT middle
const dashboardRoutes = (fastify, options, done) => {
  fastify.get('/detail/:tenantId', Swagger.detail, dashboardController.detail);
  done();
};

module.exports = dashboardRoutes;
