// const multer = require('fastify-multer');
const Controller = require('./shopType.controller');
const Swagger = require('./shopType.swagger');

// TODO: JWT middle
const shopTypeRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, Controller.list);
  fastify.get('/get/:shopTypeId', Swagger.find, Controller.find);
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post('/update/:shopTypeId', Swagger.update, Controller.update);
  fastify.post('/update/status/:shopTypeId', Swagger.updateStatus, Controller.updateStatus);
  done();
};

module.exports = shopTypeRoutes;
