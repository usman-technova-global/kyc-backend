const Controller = require('./attachment.controller');
const Swagger = require('./attachment.swagger');

// TODO: JWT middle
const VideosRoutes = (fastify, options, done) => {
  fastify.get('/list/:projectId?', Swagger.list, Controller.List);
  done();
};
module.exports = VideosRoutes;
