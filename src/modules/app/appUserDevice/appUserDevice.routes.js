const appUserDeviceController = require('./appUserDevice.controller');
const appUserDeviceSwagger = require('./appUserDevice.swagger');

function appUserDeviceRoutes(fastify, options, done) {
  fastify.post(
    '/register-device',
    appUserDeviceSwagger.registerDevice,
    appUserDeviceController.registerDevice
  );
  done();
}

module.exports = appUserDeviceRoutes;
