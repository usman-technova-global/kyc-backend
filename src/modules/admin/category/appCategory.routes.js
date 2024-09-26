const categoryRoutes = require('./appCategory/category.routes');
const categoryServiceRoutes = require('./appCategoryService/categoryService.routes');
const categoryServiceFaqRoutes = require('./appCategoryServiceFaq/categoryServiceFaq.routes');

const appCategoryRoutes = (fastify, options, done) => {
  fastify.register(categoryServiceFaqRoutes, { prefix: '/service/faq' });
  fastify.register(categoryServiceRoutes, { prefix: '/service' });
  fastify.register(categoryRoutes, { prefix: '/' });
  done();
};

module.exports = appCategoryRoutes;
