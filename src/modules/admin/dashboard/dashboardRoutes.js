const dashboardOrderRoutes = require('./dashboard/dashboard.routes');
// TODO: JWT middle
const dashboardRoutes = (fastify, options, done) => {
  fastify.register(dashboardOrderRoutes, { prefix: '/order' });
  done();
};

module.exports = dashboardRoutes;
