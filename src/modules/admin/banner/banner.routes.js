const Controller = require('./banner.controller');
const Swagger = require('./banner.swagger');

// TODO: JWT middle
const bannerRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant', Swagger.list, Controller.list);
  fastify.get('/find/:bannerId', Swagger.find, Controller.find);
  fastify.post('/create', Swagger.create, Controller.createMultipart);
  fastify.post('/update/:bannerId', Swagger.update, Controller.updateMultipart);
  fastify.post(
    '/update/status/:bannerId',
    Swagger.updateStatus,
    Controller.updateStatus
  );
  fastify.post(
    '/delete/:bannerId',
    Swagger.deleteBanner,
    Controller.deleteBanner
  );

  done();
};

module.exports = bannerRoutes;
