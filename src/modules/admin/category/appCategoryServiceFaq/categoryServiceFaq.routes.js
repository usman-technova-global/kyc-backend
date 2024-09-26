const categoryServiceFaqController = require('./categoryServiceFaq.controller');
const Swagger = require('./categoryServiceFaq.swagger');
// TODO: JWT middle
const categoryServiceFaqRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:categoryServiceId/:page/:size',
    Swagger.list,
    categoryServiceFaqController.list
  );
  fastify.get(
    '/list/:categoryServiceId/:search/:page/:size',
    Swagger.search,
    categoryServiceFaqController.search
  );
  fastify.get(
    '/get/:categoryServiceFaqId',
    Swagger.get,
    categoryServiceFaqController.findById
  );
  fastify.post(
    '/create/:categoryServiceId',
    Swagger.create,
    categoryServiceFaqController.create
  );
  fastify.post(
    '/update/:categoryServiceFaqId',
    Swagger.update,
    categoryServiceFaqController.update
  );
  fastify.post(
    '/update/status/:categoryServiceFaqId',
    Swagger.updateStatus,
    categoryServiceFaqController.updateStatus
  );
  fastify.post(
    '/delete/:categoryServiceFaqId',
    Swagger.remove,
    categoryServiceFaqController.deleteCategoryServiceFaq
  );
  done();
};

module.exports = categoryServiceFaqRoutes;
