const shopController = require('./shop.controller');
const shopSwagger = require('./shop.swagger');
// TODO: JWT middle
const shopRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:page/:size',
    shopSwagger.tenantList,
    shopController.tenantList
  );
  fastify.get(
    '/list/:search/:page/:size',
    shopSwagger.search,
    shopController.search
  );
  fastify.get('/detail/:tenantId', shopSwagger.detail, shopController.detail);
  fastify.get(
    '/detail/user/:tenantId',
    shopSwagger.detailUser,
    shopController.detailUser
  );
  fastify.get('/edit/:tenantId', shopSwagger.detail, shopController.edit);
  fastify.get('/get/:tenantId', shopSwagger.detail, shopController.get);
  fastify.get(
    '/owner/detail/:tenantId',
    shopSwagger.detail,
    shopController.ownerDetail
  );
  fastify.get(
    '/branch/detail/user/:tenantId',
    shopSwagger.detailUser,
    shopController.branchDetailUser
  );
  fastify.post('/insert', shopSwagger.insert, shopController.insert);
  fastify.post('/update/:tenantId', shopSwagger.update, shopController.update);
  fastify.post(
    '/update/status/:tenantId',
    shopSwagger.updateStatus,
    shopController.updateStatus
  );

  done();
};

module.exports = shopRoutes;
