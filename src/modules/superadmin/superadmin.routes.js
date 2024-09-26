const backOfficeUserRoutes = require('./backofficeUser/backofficeUser.routes');
const tenantRoutes = require('./tenant/tenant.routes');
const permissionRoutes = require('./permission/permission.routes');
const rabbitMqRoutes = require('./rabbitMq/rabbitMq.routes');
const s3UploadTestRoutes = require('./s3UploadTest/s3UploadTest.routes');
const roleRoutes = require('./role/role.routes');
const appImageRoutes = require('./appImage/appImage.routes');
const themeRoutes = require('./theme/theme.routes');
const ratingRoutes = require('./rating/rating.routes');
const shopTypeRoutes = require('./shopType/shopType.routes');
const secureSuperAdminRoutes = require('../../utils/security/secureSuperAdminRoutes');
// TODO: JWT middle
const superadminRoutes = (fastify, options, done) => {
  secureSuperAdminRoutes.secureSuperAdmin(fastify);
  fastify.register(backOfficeUserRoutes, { prefix: '/backofficeUser' });
  fastify.register(tenantRoutes, { prefix: '/tenant' });
  fastify.register(permissionRoutes, { prefix: '/permission' });
  fastify.register(rabbitMqRoutes, { prefix: '/rabbitMq' });
  fastify.register(s3UploadTestRoutes, { prefix: '/s3uploadtest' });
  fastify.register(roleRoutes, { prefix: '/role' });
  fastify.register(appImageRoutes, { prefix: '/appImage' });
  fastify.register(themeRoutes, { prefix: '/theme' });
  fastify.register(ratingRoutes, { prefix: '/rating' });
  fastify.register(shopTypeRoutes, { prefix: '/shop-type' });
  done();
};

module.exports = superadminRoutes;
