// const multer = require('fastify-multer');
const Controller = require('./faq.controller');
const Swagger = require('./faq.swagger');

// TODO: JWT middle
const ratingRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant', Swagger.list, Controller.list);
  done();
};

module.exports = ratingRoutes;
