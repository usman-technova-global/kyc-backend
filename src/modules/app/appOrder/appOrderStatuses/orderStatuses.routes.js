const orderStatusesController = require('./orderStatuses.controller');
const Swagger = require('./orderStatuses.swagger');
// TODO: JWT middle
const orderStatusesRoutes = (fastify, options, done) => {
  fastify.post('/create', Swagger.create, orderStatusesController.create);
  done();
};

module.exports = orderStatusesRoutes;
