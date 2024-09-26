const voucherController = require('./voucher.controller');
const voucherSwagger = require('./voucher.swagger');

const voucherRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenantId',
    voucherSwagger.getVoucher,
    voucherController.getVoucher
  );
  fastify.post(
    '/create/:tenantId',
    voucherSwagger.createVoucher,
    voucherController.createVoucher
  );
  fastify.post(
    '/update/:tenantId/:id',
    voucherSwagger.updateVoucher,
    voucherController.updateVoucher
  );
  fastify.post(
    '/update/status',
    voucherSwagger.updateStatus,
    voucherController.updateStatus
  );
  fastify.post(
    '/delete/:tenantId/:id',
    voucherSwagger.deleteVoucher,
    voucherController.deleteVoucher
  );
  fastify.get(
    '/promotion/:tenant/:appUser',
    voucherSwagger.promotion,
    voucherController.promotion
  );

  done();
};

module.exports = voucherRoutes;
