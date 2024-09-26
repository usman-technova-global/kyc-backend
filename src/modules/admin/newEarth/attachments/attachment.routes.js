const Controller = require('./attachment.controller');
const Swagger = require('./attachment.swagger');

// TODO: JWT middle
const VideosRoutes = (fastify, options, done) => {
  fastify.post('/store/:tenantId', Swagger.store, Controller.store);
  fastify.get('/list/:projectId?', Swagger.list, Controller.List);
  fastify.post('/update/:id', Swagger.update, Controller.update);
  fastify.post('/delete', Swagger.delete, Controller.deleteAttachment);
  done();
};
module.exports = VideosRoutes;
