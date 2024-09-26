const Controller = require('./appUser.controller');
const Swagger = require('./appUser.swagger');

// TODO: JWT middle
const appUserRoutes = (fastify, options, done) => {
  fastify.post('/login', Swagger.login, Controller.login);
  fastify.post(
    '/anonymous/login',
    Swagger.anonymousLogin,
    Controller.anonymousLogin
  );
  fastify.get(
    '/list/:tenant/:userType/:page/:size',
    Swagger.list,
    Controller.list
  );
  fastify.get(
    '/list/:tenant/:userType/:search/:page/:size',
    Swagger.search,
    Controller.search
  );
  fastify.post('/create', Swagger.create, Controller.create);
  fastify.get('/edit/:userId', Swagger.edit, Controller.edit);
  fastify.post('/update', Swagger.update, Controller.update);
  fastify.post('/update/status', Swagger.updateStatus, Controller.updateStatus);
  fastify.post('/delete', Swagger.deleteUser, Controller.deleteUser);
  fastify.get('/detail/:userId', Swagger.detail, Controller.detail);

  fastify.post(
    '/address/create',
    Swagger.addressCreate,
    Controller.addressCreate
  );

  fastify.get(
    '/address/edit/:addressId',
    Swagger.addressEdit,
    Controller.addressEdit
  );

  fastify.post(
    '/address/update',
    Swagger.addressUpdate,
    Controller.addressUpdate
  );

  fastify.post(
    '/address/update/status',
    Swagger.addressUpdateStatus,
    Controller.addressUpdateStatus
  );

  fastify.post(
    '/schedule/create',
    Swagger.scheduleCreate,
    Controller.scheduleCreate
  );

  fastify.get(
    '/schedule/edit/:scheduleId',
    Swagger.scheduleFind,
    Controller.scheduleFind
  );

  fastify.post(
    '/schedule/update',
    Swagger.scheduleUpdate,
    Controller.scheduleUpdate
  );

  fastify.post(
    '/schedule/update/status',
    Swagger.scheduleUpdateStatus,
    Controller.scheduleUpdateStatus
  );

  fastify.get(
    '/voucher/history/list/:appUser/:page/:size',
    Swagger.voucherHistoryList,
    Controller.voucherHistoryList
  );
  fastify.get(
    '/voucher/history/list/:appUser/:search/:page/:size',
    Swagger.voucherHistorySearch,
    Controller.voucherHistorySearch
  );
  fastify.get(
    '/voucher/history/detail/:voucherHistoryId',
    Swagger.voucherHistorydetail,
    Controller.voucherHistoryDetail
  );

  fastify.get(
    '/loyalty/history/list/:appUser/:page/:size',
    Swagger.loyaltyHistoryList,
    Controller.loyaltyHistoryList
  );
  fastify.get(
    '/loyalty/history/list/:appUser/:search/:page/:size',
    Swagger.loyaltyHistorySearch,
    Controller.loyaltyHistorySearch
  );
  fastify.get(
    '/loyalty/history/detail/:loyaltyHistoryId',
    Swagger.loyaltyHistorydetail,
    Controller.loyaltyHistoryDetail
  );

  fastify.get('/driver/list', Swagger.driverList, Controller.driverList);
  fastify.get(
    '/driver/detail/:appUser',
    Swagger.driverDetail,
    Controller.driverDetail
  );
  fastify.get(
    '/driver/wallet/detail/:wallets',
    Swagger.driverWalletDetail,
    Controller.driverWalletDetail
  );
  fastify.get('/lov/:tenant', Swagger.lov, Controller.lov);

  done();
};

module.exports = appUserRoutes;
