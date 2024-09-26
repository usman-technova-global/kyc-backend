const plansRoutes = require('./projectPlans/projectPlans.routes');
const ProjectRoutes = require('./projects/projects.routes');
const attachmentsRoutes = require('./attachments/attachment.routes');

// TODO: JWT middle
const newEarthRoutes = (fastify, options, done) => {
  fastify.register(plansRoutes, { prefix: '/plans' });
  fastify.register(ProjectRoutes, { prefix: '/projects' });
  fastify.register(attachmentsRoutes, { prefix: '/attachments' });
  done();
};

module.exports = newEarthRoutes;
