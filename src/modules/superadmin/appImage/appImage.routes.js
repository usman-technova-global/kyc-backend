const Controller = require('./appImage.controller');
const Swagger = require('./appImage.swagger');

// TODO: JWT middle
const appImageRoutes = (fastify, options, done) => {
  fastify.get('/list/:page/:size', Swagger.listSwagger, Controller.list);
  fastify.get(
    '/list/:search/:page/:size',
    Swagger.searchSwagger,
    Controller.search
  );
  fastify.get('/get/:id', Swagger.editSwagger, Controller.edit);
  fastify.post('/create', Swagger.create, Controller.createMultipart);
  fastify.post('/update/:id', Swagger.update, Controller.updateMultipart);

  done();
};

module.exports = appImageRoutes;
