// const multer = require('fastify-multer');
const Controller = require('./faq.controller');
const Swagger = require('./faq.swagger');

// TODO: JWT middle
const ratingRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant', Swagger.list, Controller.list);
  fastify.get('/find/:faqId', Swagger.find, Controller.find);
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post('/update/:faqId', Swagger.update, Controller.update);
  fastify.post('/update/status/:faqId', Swagger.updateStatus, Controller.updateStatus);
  done();
};

module.exports = ratingRoutes;
