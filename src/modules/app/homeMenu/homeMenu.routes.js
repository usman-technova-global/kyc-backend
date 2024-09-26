const homeMenuController = require('./homeMenu.controller');
const Swagger = require('./homeMenu.swagger');

const homeMenuRoutes = (fastify, options, done) => {
  fastify.get(
    '/list/:tenantId',
    Swagger.listByTenantId,
    homeMenuController.listByTenantId
  );
  fastify.get('/view/:tenantId/:menuId', Swagger.view, homeMenuController.view);
  fastify.get(
    '/view/submenu/:tenantId/:menuId/:submenuId',
    Swagger.viewSubMenu,
    homeMenuController.viewSubMenu
  );
  done();
};

module.exports = homeMenuRoutes;
