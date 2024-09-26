// const multer = require('fastify-multer');
const Controller = require('./rating.controller');
const Swagger = require('./rating.swagger');

// TODO: JWT middle
const ratingRoutes = (fastify, options, done) => {
  fastify.get('/list/:tenant', Swagger.list, Controller.list);
  fastify.get(
    '/item/detail/:homeCatItem',
    Swagger.detailHomeCatItem,
    Controller.detailHomeCatItem
  );
  fastify.get('/reviews/:homeCatItem', Swagger.reviews, Controller.reviews);
  fastify.get(
    '/distinct/star/list/:homeCatItem',
    Swagger.distinctStarList,
    Controller.getDistinctStars
  );

  done();
};

module.exports = ratingRoutes;
