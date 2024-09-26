// const secureUserAppRoutes = require('../../utils/security/secureUserAppRoutes');
const Controller = require('./email.controller');
const Swagger = require('./email.swagger');

const emailRoutes = (fastify, options, done) => {
  // secureUserAppRoutes.secure(fastify);
  fastify.post(
    '/sent/new/phrase/:userId',
    Swagger.newPhraseSchema,
    Controller.newPhraseEmail
  );

  done();
};

module.exports = emailRoutes;
