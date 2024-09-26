const vendorController = require('./vendors.controller');
const Swagger = require('./vendors.swagger');
// TODO: JWT middle
const vendorRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, vendorController.List);
  fastify.get('/find/:id', Swagger.find, vendorController.find);
  fastify.post('/create', Swagger.store, vendorController.store);
  fastify.post('/update/:id', Swagger.update, vendorController.update);
  fastify.post('/delete', Swagger.delete, vendorController.deleteVendor);
  fastify.get('/list/lov', Swagger.lov, vendorController.Lov);
  done();
};

module.exports = vendorRoutes;
