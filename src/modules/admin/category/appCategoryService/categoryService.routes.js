const categoryServiceController = require('./categoryService.controller');
const Swagger = require('./categoryService.swagger');
// TODO: JWT middle
const categoryServiceRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:categoryId/:page/:size',
    Swagger.list,
    categoryServiceController.list
  );
  fastify.get(
    '/list/:categoryId/:search/:page/:size',
    Swagger.search,
    categoryServiceController.search
  );
  fastify.get(
    '/get/:categoryServiceId',
    Swagger.get,
    categoryServiceController.findById
  );
  fastify.post(
    '/update/status/:categoryServiceId',
    Swagger.updateStatus,
    categoryServiceController.updateStatus
  );
  fastify.post(
    '/delete/:categoryServiceId',
    Swagger.remove,
    categoryServiceController.deleteCategoryService
  );
  fastify.post(
    '/create/:categoryId',
    Swagger.create,
    categoryServiceController.create
  );
  fastify.post(
    '/update/:categoryServiceId',
    Swagger.update,
    categoryServiceController.updateMultipart
  );
  done();
};

module.exports = categoryServiceRoutes;
