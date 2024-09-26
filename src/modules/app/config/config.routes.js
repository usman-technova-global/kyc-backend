const configController = require('./config.controller');
const configSwagger = require('./config.swagger');

const configRoutes = (fastify, options, done) => {
  fastify.get(
    '/view/:tenantId',
    configSwagger.viewConfig,
    configController.view
  );
  done();
};

module.exports = configRoutes;
