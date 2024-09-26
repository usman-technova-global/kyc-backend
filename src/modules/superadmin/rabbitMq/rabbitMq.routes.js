const backOfficeUserController = require('./rabbitMq.controller');
const Swagger = require('./rabbitMq.swagger');
// TODO: JWT middle
const backOfficeUserRoutes = (fastify, options, done) => {
  fastify.post('/send', Swagger.send, backOfficeUserController.send);
  done();
};

module.exports = backOfficeUserRoutes;
