const backOfficeUserController = require('./backofficeUser.controller');
const backOfficeUserSwagger = require('./backofficeUser.swagger');

// TODO: JWT middle
const backOfficeUserRoutes = (fastify, options, done) => {
  fastify.post(
    '/login',
    backOfficeUserSwagger.login,
    backOfficeUserController.login
  );
  fastify.get(
    '/profile/:userId',
    backOfficeUserSwagger.profile,
    backOfficeUserController.profile
  );
  fastify.post(
    '/profile/update',
    backOfficeUserSwagger.updateProfile,
    backOfficeUserController.profileUpdate
  );
  fastify.get(
    '/refresh/token',
    backOfficeUserSwagger.refreshToken,
    backOfficeUserController.refreshToken
  );

  done();
};

module.exports = backOfficeUserRoutes;
