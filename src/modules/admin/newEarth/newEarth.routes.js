const plansRoutes = require('./projectPlans/projectPlans.routes');
const ProjectRoutes = require('./projects/projects.routes');
const ProductRoutes = require('./products/products.routes');
const attachmentsRoutes = require('./attachments/attachment.routes');
const rolesRoutes = require('./role/role.routes');
const vendorsRoutes = require('./vendors/vendors.routes');

// TODO: JWT middle
const newEarthRoutes = (fastify, options, done) => {
  fastify.register(plansRoutes, { prefix: '/plans' });
  fastify.register(ProjectRoutes, { prefix: '/projects' });
  fastify.register(ProductRoutes, { prefix: '/products' });
  fastify.register(attachmentsRoutes, { prefix: '/attachments' });
  fastify.register(rolesRoutes, { prefix: '/roles' });
  fastify.register(vendorsRoutes, { prefix: '/vendors' });
  done();
};

module.exports = newEarthRoutes;
