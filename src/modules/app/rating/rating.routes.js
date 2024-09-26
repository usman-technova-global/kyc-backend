// const multer = require('fastify-multer');
const Controller = require('./rating.controller');
const Swagger = require('./rating.swagger');

// TODO: JWT middle
const ratingRoutes = (fastify, options, done) => {
  fastify.get('/list/:page/:size', Swagger.list, Controller.list);
  fastify.post('/insert/:appOrderItem', Swagger.insert, Controller.insert);
  fastify.get(
    '/reviews/:tenant/:homeCatItem',
    Swagger.reviews,
    Controller.reviews
  );
  fastify.get(
    '/distinct/star/list/:tenant/:homeCatItem',
    Swagger.distinctStarList,
    Controller.getDistinctStars
  );

  done();
};

module.exports = ratingRoutes;
