const branchController = require('./branch.controller');
const branchSwagger = require('./branch.swagger');
// TODO: JWT middle
const branchRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenant/:page/:size',
    branchSwagger.list,
    branchController.list
  );
  fastify.get(
    '/list/:tenant/:search/:page/:size',
    branchSwagger.search,
    branchController.search
  );
  fastify.get('/detail/:tenant', branchSwagger.detail, branchController.detail);
  fastify.get(
    '/setting/:tenant',
    branchSwagger.detail,
    branchController.setting
  );
  fastify.get(
    '/category/:tenant',
    branchSwagger.detail,
    branchController.category
  );
  fastify.post(
    '/insert/:tenant',
    branchSwagger.insert,
    branchController.insert
  );
  fastify.get('/edit/:tenant', branchSwagger.detail, branchController.edit);
  fastify.post('/update/:id', branchSwagger.update, branchController.update);
  fastify.post(
    '/update/status/:id',
    branchSwagger.updateStatus,
    branchController.updateStatus
  );

  done();
};

module.exports = branchRoutes;
