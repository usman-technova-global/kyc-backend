const backOfficeUserRoutes = require('./backofficeUser/backofficeUser.routes');
const appOrderRoutes = require('./order/appOrder.routes');
const appCartRoutes = require('./cart/appCart.routes');
const notificationRoutes = require('./notification/notification.routes');
const categoryRoutes = require('./category/appCategory.routes');
const voucherRoutes = require('./voucher/voucher.routes');
const appSettingRoutes = require('./setting/appSetting.routes');
const dashboardRoutes = require('./dashboard/dashboardRoutes');
const branchRoutes = require('./branch/branch.routes');
const bannerRoutes = require('./banner/banner.routes');
const appointmentRoutes = require('./appointment/appointment.routes');
const appUserRoutes = require('./appUser/appUser.routes');
const ratingRoutes = require('./rating/rating.routes');
const secureAdminRoutes = require('../../utils/security/secureAdminRoutes');
const faqRoutes = require('./faq/faq.routes');
const storeRoutes = require('./store/store.routes');
const walletRoutes = require('./wallet/wallet.routes');
const newEarthRoutes = require('./newEarth/newEarth.routes');
// const secureRoutes = require('../../utils/security/secureAdminRoutes');
// TODO: JWT middle
const adminRoutes = (fastify, options, done) => {
  secureAdminRoutes.secureAdmin(fastify);
  fastify.register(backOfficeUserRoutes, { prefix: '/backofficeUser' });
  fastify.register(newEarthRoutes, { prefix: '/new-earth' });
  fastify.register(appOrderRoutes, { prefix: '/order' });
  fastify.register(appCartRoutes, { prefix: '/cart' });
  fastify.register(notificationRoutes, { prefix: '/notification' });
  fastify.register(categoryRoutes, { prefix: '/category' });
  fastify.register(voucherRoutes, { prefix: '/voucher' });
  fastify.register(appSettingRoutes, { prefix: '/setting' });
  fastify.register(dashboardRoutes, { prefix: '/dashboard' });
  fastify.register(branchRoutes, { prefix: '/branch' });
  fastify.register(appointmentRoutes, { prefix: '/appointment' });
  fastify.register(bannerRoutes, { prefix: '/banner' });
  fastify.register(appUserRoutes, { prefix: '/app/user' });
  fastify.register(ratingRoutes, { prefix: '/rating' });
  fastify.register(faqRoutes, { prefix: '/faq' });
  fastify.register(storeRoutes, { prefix: '/store' });
  fastify.register(walletRoutes, { prefix: '/wallet' });

  done();
};

module.exports = adminRoutes;
