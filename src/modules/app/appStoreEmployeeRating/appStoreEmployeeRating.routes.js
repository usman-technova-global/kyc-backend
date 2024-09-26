const appStoreEmployeeRatingController = require('./appStoreEmployeeRating.controller');
const appStoreEmployeeRating = require('./appStoreEmployeeRating.swagger');

function appEmployeeRatingRoutes(fastify, options, done) {
  fastify.get(
    '/list',
    appStoreEmployeeRating.getEmployeeRating,
    appStoreEmployeeRatingController.employeeRatingList
  );

  fastify.patch(
    '/update/:id',
    appStoreEmployeeRating.updateEmployeeRating,
    appStoreEmployeeRatingController.updateEmployeeRating
  );
  done();
}

module.exports = appEmployeeRatingRoutes;
