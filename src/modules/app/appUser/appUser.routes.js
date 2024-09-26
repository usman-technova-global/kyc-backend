const appUserController = require('./appUser.controller');
const appUserSwagger = require('./appUser.swagger');

function appUserRoutes(fastify, options, done) {
  fastify.post(
    '/sign-up/app',
    appUserSwagger.createUserApp,
    appUserController.createUserApp
  );
  fastify.post(
    '/sign-up/driver',
    appUserSwagger.createUserDriver,
    appUserController.createUserDriver
  );
  fastify.post(
    '/sign-in/app',
    appUserSwagger.signInApp,
    appUserController.signInApp
  );
  fastify.post(
    '/sign-in/app/facebook',
    appUserSwagger.signInAppFacebook,
    appUserController.signInAppFacebook
  );
  fastify.post(
    '/sign-in/driver',
    appUserSwagger.signInDriver,
    appUserController.signInDriver
  );
  fastify.post(
    '/update',
    appUserSwagger.updateUser,
    appUserController.updateUser
  );
  fastify.post(
    '/get-otp/:tenant',
    appUserSwagger.getOTP,
    appUserController.getOTP
  );
  fastify.get(
    '/profile',
    appUserSwagger.getProfile,
    appUserController.getProfile
  );

  fastify.post(
    '/setStatus',
    appUserSwagger.setStatus,
    appUserController.setStatus
  );

  fastify.post(
    '/forgotPassword/app',
    appUserSwagger.forgotPasswordApp,
    appUserController.forgotPasswordApp
  );

  fastify.post(
    '/resetPassword/app',
    appUserSwagger.resetPasswordApp,
    appUserController.resetPasswordApp
  );

  fastify.post(
    '/forgotPassword/driver',
    appUserSwagger.forgotPasswordDriver,
    appUserController.forgotPasswordDriver
  );

  fastify.post(
    '/resetPassword/driver',
    appUserSwagger.resetPasswordDriver,
    appUserController.resetPasswordDriver
  );

  fastify.get(
    '/loyalty/history/list/:page/:size',
    appUserSwagger.loyaltyHistoryList,
    appUserController.loyaltyHistoryList
  );

  done();
}

module.exports = appUserRoutes;
