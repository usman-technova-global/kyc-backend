const settingController = require('./setting.controller');
const Swagger = require('./setting.swagger');
// TODO: JWT middle
const settingRoutes = (fastify, options, done) => {
  fastify.get('/get/:tenant', Swagger.get, settingController.get);
  fastify.get(
    '/address/:tenant',
    Swagger.getAddress,
    settingController.getAddress
  );
  fastify.post(
    '/update/:tenant',
    Swagger.update,
    settingController.updateMultipart
  );
  fastify.post(
    '/update/media/:tenant',
    Swagger.updateMedia,
    settingController.updateMedia
  );
  done();
};

module.exports = settingRoutes;
