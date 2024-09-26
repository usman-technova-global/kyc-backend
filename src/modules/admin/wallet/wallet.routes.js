// const multer = require('fastify-multer');
const Controller = require('./wallet.controller');
const Swagger = require('./wallet.swagger');

// TODO: JWT middle
const walletRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, Controller.list);
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.post(
    '/update/:wallets',
    Swagger.updateWallet,
    Controller.updateWallet
  );
  fastify.get(
    '/transactions/:wallets',
    Swagger.transactions,
    Controller.transactions
  );

  done();
};

module.exports = walletRoutes;
