const Controller = require('./orderPlace.controller');
const Swagger = require('./orderPlace.swagger');
// TODO: JWT middle
const orderPlaceRoutes = (fastify, options, done) => {
  fastify.post(
    '/getCart/user',
    Swagger.getCartByUser,
    Controller.getCartByUser
  );
  fastify.get(
    '/category/list/:tenant',
    Swagger.categoryList,
    Controller.categoryList
  );
  fastify.get(
    '/category/item/list/:categoryId',
    Swagger.catItemList,
    Controller.catItemList
  );

  fastify.post('/updateCart', Swagger.updateCart, Controller.updateCart);
  fastify.post('/newOrder', Swagger.newOrder, Controller.newOrder);

  done();
};

module.exports = orderPlaceRoutes;
