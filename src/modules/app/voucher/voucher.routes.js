const voucherController = require('./voucher.controller');
const voucherSwagger = require('./voucher.swagger');

const voucherRoutes = (fastify, options, done) => {
  fastify.get(
    '/promotion/list',
    voucherSwagger.promotion,
    voucherController.promotion
  );
  done();
};

module.exports = voucherRoutes;
