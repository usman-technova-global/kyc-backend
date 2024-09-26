const Controller = require('./service.controller');
const Swagger = require('./service.swagger');
// TODO: JWT middle
const serviceRoutes = (fastify, options, done) => {
  fastify.get('/category/list', Swagger.categoryList, Controller.categoryList);
  fastify.post(
    '/category/create',
    Swagger.categoryCreate,
    Controller.categoryCreate
  );
  fastify.post(
    '/category/update/:categoryId',
    Swagger.categoryUpdate,
    Controller.categoryUpdate
  );
  fastify.post(
    '/category/update/status/:categoryId',
    Swagger.categoryUpdateStatus,
    Controller.categoryUpdateStatus
  );
  fastify.post(
    '/category/delete/:categoryId',
    Swagger.categoryDelete,
    Controller.categoryDelete
  );

  fastify.get('/category/lov', Swagger.categoryLov, Controller.categoryLov);

  fastify.get(
    '/category/item/list/:categoryId',
    Swagger.categoryItemList,
    Controller.categoryItemList
  );
  fastify.post(
    '/category/item/create',
    Swagger.categoryItemCreate,
    Controller.categoryItemCreate
  );
  fastify.post(
    '/category/item/update/:categoryItemId',
    Swagger.categoryItemUpdate,
    Controller.categoryItemUpdate
  );
  fastify.post(
    '/category/item/update/status/:categoryItemId',
    Swagger.categoryItemUpdateStatus,
    Controller.categoryItemUpdateStatus
  );
  fastify.post(
    '/category/item/delete/:categoryItemId',
    Swagger.categoryItemDelete,
    Controller.categoryItemDelete
  );

  fastify.get(
    '/category/item/lov/:categoryId',
    Swagger.categoryItemLov,
    Controller.categoryItemLov
  );

  done();
};

module.exports = serviceRoutes;
