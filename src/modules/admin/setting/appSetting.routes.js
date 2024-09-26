const settingRoutes = require('./appSetting/setting.routes');
const shopScheduleRoutes = require('./shopScheduling/shopScheduling.routes');

// TODO: JWT middle
const appSettingRoutes = (fastify, options, done) => {
  fastify.register(settingRoutes, { prefix: '/' });
  fastify.register(shopScheduleRoutes, { prefix: '/shop-schedule' });

  done();
};

module.exports = appSettingRoutes;
