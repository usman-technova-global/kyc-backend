const JwtAuth = require('./oauth');
const { apiFailResponse } = require('../commonUtil');
const { getValue } = require('../../config/redisClient');
const HTTP_STATUS = require('../constants/httpStatus');

const appRouteScheme = 'api/v1/super-admin/';
const insecureRoute = [
  'api/v1/super-admin/backofficeUser/login',
  'api/v1/super-admin/backofficeUser/refresh/token',
];

const JWTKey = async (tenant, key) => {
  const storedJWTKey = getValue(tenant, key);
  return storedJWTKey;
};

function secureSuperAdmin(fastify) {
  fastify.addHook('onRequest', async (request, reply) => {
    try {
      // if it is app route
      if (request.url.includes(appRouteScheme)) {
        const found = insecureRoute.filter((route) =>
          request.url.includes(route)
        );
        // For insecure route, put any logic if requires
        // eslint-disable-next-line no-empty
        if (found.length > 0) {
          return;
        }
        // For secure routes, check the token

        // const token = request.headers.authorization;
        // const token = JWT;
        const token = await JWTKey(
          process.env.SUPER_ADMIN_SECRET_KEY,
          request.headers.authorization
        );

        if (!token) {
          // const objResult = apiFailResponse(
          //   '403 unauthorized, please check the header.',
          //   null,
          //   HTTP_STATUS.FORBIDDEN
          // );
          const objResult = apiFailResponse(
            '401 unauthorized, please check the header.',
            null,
            HTTP_STATUS.UNAUTHORIZED
          );
          reply.code(HTTP_STATUS.UNAUTHORIZED).send(objResult);
        }

        const verificationResult = await JwtAuth.verifyTokenForAdmin(token);
        if (!verificationResult.result) {
          reply.code(HTTP_STATUS.UNAUTHORIZED).send({
            message: verificationResult.message,
            success: false,
            code: HTTP_STATUS.UNAUTHORIZED,
          });
        }
        // Set login user to the session request

        request.session = verificationResult.data;
      }
    } catch (err) {
      reply.send(err);
    }
  });
}

module.exports = { secureSuperAdmin };
