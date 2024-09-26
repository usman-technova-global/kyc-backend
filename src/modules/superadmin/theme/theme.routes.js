const Controller = require('./theme.controller');
const Swagger = require('./theme.swagger');
// TODO: JWT middle
const themeRoutes = (fastify, options, done) => {
  fastify.get('/list/:page/:size', Swagger.list, Controller.list);
  fastify.get('/lov/list', Swagger.lovlist, Controller.lovList);
  fastify.get('/list/:search/:page/:size', Swagger.search, Controller.search);
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post('/update/:themeId', Swagger.update, Controller.update);
  fastify.get('/get/:themeId', Swagger.find, Controller.find);
  done();
};

module.exports = themeRoutes;
