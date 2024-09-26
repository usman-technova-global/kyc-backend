const permissionController = require('./permission.controller');
const Swagger = require('./permission.swagger');

const permissionRoutes = (fastify, options, done) => {
  fastify.get('/list', Swagger.list, permissionController.list);
  fastify.get('/view/:permissionId', Swagger.view, permissionController.view);
  fastify.post('/create', Swagger.create, permissionController.create);
  fastify.get(
    '/list/:page/:size',
    Swagger.paginationList,
    permissionController.paginationList
  );
  fastify.get(
    '/list/:search/:page/:size',
    Swagger.paginationSearch,
    permissionController.paginationSearch
  );
  fastify.post(
    '/insert',
    Swagger.create,
    permissionController.createPermission
  );
  fastify.get('/edit/:id', Swagger.edit, permissionController.getPermission);
  fastify.post(
    '/update/:id',
    Swagger.update,
    permissionController.updatePermission
  );
  fastify.post(
    '/update/status/:id',
    Swagger.updateStatus,
    permissionController.updateStatus
  );
  fastify.get(
    '/child/list/:page/:size/:id',
    Swagger.childList,
    permissionController.childList
  );
  fastify.get(
    '/child/list/:search/:page/:size/:id',
    Swagger.childsearch,
    permissionController.childSearch
  );
  fastify.post(
    '/child/update/status/:id',
    Swagger.updateStatus,
    permissionController.childUpdateStatus
  );
  done();
};

module.exports = permissionRoutes;
