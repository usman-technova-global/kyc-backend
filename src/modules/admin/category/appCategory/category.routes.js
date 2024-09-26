const categoryController = require('./category.controller');
const categorySwagger = require('./category.swagger');

// TODO: JWT middle
const categoryRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenant/:page/:size',
    categorySwagger.list,
    categoryController.list
  );
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    categorySwagger.search,
    categoryController.search
  );
  fastify.get(
    '/get/:categoryId',
    categorySwagger.findById,
    categoryController.findById
  );
  fastify.post(
    '/update/status/:categoryId',
    categorySwagger.updateStatus,
    categoryController.updateStatus
  );
  fastify.post(
    '/delete/:categoryId',
    categorySwagger.deleteCategory,
    categoryController.deleteCategory
  );
  fastify.post('/create', categorySwagger.create, categoryController.create);
  fastify.post(
    '/update/:categoryId',
    categorySwagger.update,
    categoryController.updateMultipart
  );

  done();
};

module.exports = categoryRoutes;
