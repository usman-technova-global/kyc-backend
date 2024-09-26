// const multer = require('fastify-multer');
const Controller = require('./banner.controller');
const Swagger = require('./banner.swagger');

// TODO: JWT middle
const bannerRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, Controller.list);

  done();
};

module.exports = bannerRoutes;
