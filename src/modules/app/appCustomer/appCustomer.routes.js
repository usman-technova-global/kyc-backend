const appCustomerController = require('./appCustomer.controller');
const appCustomerSwagger = require('./appCustomer.swagger');

function appCustomerRoutes(fastify, options, done) {

  fastify.post(
    '/create',
    appCustomerSwagger.createCustomer,
    appCustomerController.createCustomer
  );

  fastify.get(
    '/list',
    appCustomerSwagger.getCustomerList,
    appCustomerController.getCustomerList
  );

  fastify.post('/delete/:id', appCustomerSwagger.del, appCustomerController.del);
  done();
}

module.exports = appCustomerRoutes;
