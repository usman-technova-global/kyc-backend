const roleController = require('./role.controller');
const Swagger = require('./role.swagger');
// TODO: JWT middle
const roleRoutes = (fastify, options, done) => {
  fastify.get('/list/:page/:size', Swagger.list, roleController.list);
  fastify.get(
    '/list/:search/:page/:size',
    Swagger.search,
    roleController.search
  );
  fastify.post('/create', Swagger.create, roleController.create);
  fastify.get(
    '/permissions',
    Swagger.getPermissions,
    roleController.permissions
  );
  fastify.get('/permission/:id', Swagger.permission, roleController.get);
  fastify.post('/update/:id', Swagger.update, roleController.update);
  fastify.post(
    '/update/status/:id',
    Swagger.updateStatus,
    roleController.updateStatus
  );
  fastify.get('/list/lov', Swagger.lov, roleController.lov);
  done();
};

module.exports = roleRoutes;
