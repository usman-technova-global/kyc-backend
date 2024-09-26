const backOfficeUserController = require('./backofficeUser.controller');
const backOfficeUserSwagger = require('./backofficeUser.swagger');

// TODO: JWT middle
const backOfficeUserRoutes = (fastify, options, done) => {
  fastify.get(
    '/list',
    backOfficeUserSwagger.userList,
    backOfficeUserController.userList
  );
  fastify.get(
    '/view/:userId',
    backOfficeUserSwagger.userView,
    backOfficeUserController.userView
  );
  fastify.post(
    '/create',
    backOfficeUserSwagger.createUser,
    backOfficeUserController.createUser
  );
  fastify.post(
    '/login',
    backOfficeUserSwagger.login,
    backOfficeUserController.login
  );
  fastify.get(
    '/list/:tenant/:page/:size',
    backOfficeUserSwagger.list,
    backOfficeUserController.list
  );
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    backOfficeUserSwagger.search,
    backOfficeUserController.search
  );
  fastify.get(
    '/edit/:userId',
    backOfficeUserSwagger.userView,
    backOfficeUserController.edit
  );

  fastify.post(
    '/insert',
    backOfficeUserSwagger.insert,
    backOfficeUserController.insert
  );

  fastify.post(
    '/update/:userId',
    backOfficeUserSwagger.update,
    backOfficeUserController.update
  );

  fastify.post(
    '/update/status/:userId',
    backOfficeUserSwagger.updateStatus,
    backOfficeUserController.updateStatus
  );

  fastify.post(
    '/delete/:userId',
    backOfficeUserSwagger.deleteUser,
    backOfficeUserController.deleteUser
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

  fastify.post(
    '/secret/update',
    backOfficeUserSwagger.secretUpdate,
    backOfficeUserController.secretUpdate
  );

  fastify.get(
    '/refresh/token',
    backOfficeUserSwagger.refreshToken,
    backOfficeUserController.refreshToken
  );

  fastify.post(
    '/get-otp',
    backOfficeUserSwagger.getOTP,
    backOfficeUserController.getOTP
  );

  fastify.post(
    '/new-password',
    backOfficeUserSwagger.changePassword,
    backOfficeUserController.changePassword
  );

  fastify.get(
    '/anonymous/detail',
    backOfficeUserSwagger.anonymousDetail,
    backOfficeUserController.anonymousDetail
  );

  done();
};

module.exports = backOfficeUserRoutes;
