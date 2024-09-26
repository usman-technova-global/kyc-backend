const fastifyStatic = require('@fastify/static');
const path = require('path');
const serveController = require('./serve.controller');
const serveSwagger = require('./serve.swagger');
const { globalVars } = require('../../../serverConst');

const staticRoutes = (fastify, options, done) => {
  const publicFolderPath = path.join(globalVars.rootPath, 'public');
  fastify.register(fastifyStatic, {
    root: publicFolderPath,
    prefix: '/public/',
  });
  fastify.get(
    '/success.html',
    serveSwagger.serveSuccess,
    serveController.serveSuccess
  );
  fastify.get(
    '/cancel.html',
    serveSwagger.serveFailure,
    serveController.serveFailure
  );
  done();
};

module.exports = staticRoutes;
