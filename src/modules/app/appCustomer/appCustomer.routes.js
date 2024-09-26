const appCustomerController = require('./appCustomer.controller');
const appCustomerSwagger = require('./appCustomer.swagger');

function appCustomerRoutes(fastify, options, done) {

  fastify.post(
    '/create',
    appCustomerSwagger.createCustomer,
    appCustomerController.createCustomer
  );


  done();
}

module.exports = appCustomerRoutes;
