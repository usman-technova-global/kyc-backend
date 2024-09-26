const appVersionRoutes = require('./appVersion/appVersion.routes');
const configRoutes = require('./config/config.routes');
const homeMenuRoutes = require('./homeMenu/homeMenu.routes');
const appUserRoutes = require('./appUser/appUser.routes');
const appUserDeviceRoutes = require('./appUserDevice/appUserDevice.routes');
const appUserAddressRoutes = require('./appUserAddress/appUserAddress.routes');
const secureUserAppRoutes = require('../../utils/security/secureUserAppRoutes');
const appUserCartRoutes = require('./appUserCart/appUserCart.routes');
const appOrderRoutes = require('./appOrder/appOrder.routes');
const shopRoutes = require('./shop/shop.routes');
const appNotificationRoutes = require('./appNotification/appNotification.routes');
const appOrderDeliveryRoutes = require('./appOrderDelivery/appOrderDelivery.routes');
const appointmentRoutes = require('./appointment/appointment.routes');
const bannerRoutes = require('./banner/banner.routes');
const ratingRoutes = require('./rating/rating.routes');
const faqRoutes = require('./faq/faq.routes');
const catRoutes = require('./categories/categories.routes');
const catItemRoutes = require('./categoriesItem/categoriesItem.routes');
const storeRoutes = require('./store/store.routes');
const storeEmployeeRating = require('./appStoreEmployeeRating/appStoreEmployeeRating.routes');
const newEarthRoutes = require('./newEarth/newEarth.routes');
const customerRoutes = require('./appCustomer/appCustomer.routes')

const appRoutes = (fastify, options, done) => {
  secureUserAppRoutes.secure(fastify);
  fastify.register(appVersionRoutes, { prefix: '/appVersion' });
  fastify.register(configRoutes, { prefix: '/config' });
  fastify.register(homeMenuRoutes, { prefix: '/homemenu' });
  fastify.register(appUserRoutes, { prefix: '/app-user' });
  fastify.register(appUserDeviceRoutes, { prefix: '/app-user-device' });
  fastify.register(appUserAddressRoutes, { prefix: '/appUserAddress' });
  fastify.register(appUserCartRoutes, { prefix: '/appUserCart' });
  fastify.register(appOrderRoutes, { prefix: '/appOrder' });
  fastify.register(shopRoutes, { prefix: '/shop' });
  fastify.register(appNotificationRoutes, { prefix: '/appNotification' });
  fastify.register(appOrderDeliveryRoutes, { prefix: '/appOrderDelivery' });
  fastify.register(appointmentRoutes, { prefix: '/appointment' });
  fastify.register(bannerRoutes, { prefix: '/banner' });
  fastify.register(ratingRoutes, { prefix: '/rating' });
  fastify.register(faqRoutes, { prefix: '/faq' });
  fastify.register(catRoutes, { prefix: '/categories' });
  fastify.register(catItemRoutes, { prefix: '/categories/items' });
  fastify.register(storeRoutes, { prefix: '/store' });
  fastify.register(storeEmployeeRating, {
    prefix: '/store/appointment-ratings',
  });
  fastify.register(newEarthRoutes, { prefix: '/new-earth' });
  fastify.register(customerRoutes, { prefix: '/customer' });
  done();
};

module.exports = appRoutes;
