const appUserAddressController = require('./appUserAddress.controller');
const appUserAddressSwagger = require('./appUserAddress.swagger');

function appUserAddressRoutes(fastify, options, done) {
  fastify.post(
    '/add',
    appUserAddressSwagger.addUserAddress,
    appUserAddressController.addUserAddress
  );
  fastify.get(
    '/list',
    appUserAddressSwagger.litsUserAddress,
    appUserAddressController.listUserAddress
  );
  fastify.put(
    '/update/status/:tenantId/:id',
    appUserAddressSwagger.updateStatusUserAddress,
    appUserAddressController.updateStatusUserAddress
  );
  fastify.delete(
    '/delete/:tenantId/:id',
    appUserAddressSwagger.deleteUserAddress,
    appUserAddressController.deleteUserAddress
  );
  done();
}

module.exports = appUserAddressRoutes;
