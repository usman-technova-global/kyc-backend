const adminRoutes = require('../modules/admin/admin.routes');
const superadminRoutes = require('../modules/superadmin/superadmin.routes');
const appRoutes = require('../modules/app/app.routes');
const emailRoutes = require('../modules/email/email.routes');
const staticRoutes = require('../modules/serve/serve.routes');
const systemConfigRoutes = require('../modules/system/system.routes');
const staffAppRoutes = require('../modules/staffapp/staffapp.routes');

const allRoutes = (fastify, options, done) => {
  fastify.register(superadminRoutes, { prefix: '/super-admin' });
  fastify.register(adminRoutes, { prefix: '/admin' });
  fastify.register(appRoutes, { prefix: '/app' });
  fastify.register(emailRoutes, { prefix: '/email' });
  fastify.register(staticRoutes, { prefix: '/public' });
  fastify.register(systemConfigRoutes, { prefix: '/system/config' });
  fastify.register(staffAppRoutes, { prefix: '/staff-app' });
  done();
};

module.exports = allRoutes;
