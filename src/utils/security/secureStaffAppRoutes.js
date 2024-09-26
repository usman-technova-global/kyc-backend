const JwtAuth = require('./oauth');
const { apiFailResponse } = require('../commonUtil');
const HTTP_STATUS = require('../constants/httpStatus');
const caseConversion = require('../commonUtils/caseConversion');
const MODULE = require('../constants/moduleNames');
const knex = require('../../config/databaseConnection');

const getTenantId = (request) => {
  if (request.body) {
    if (request.body.tenantId) {
      return request.body.tenantId;
    }
    if (request.body.tenant) {
      return request.body.tenant;
    }
  }
  if (request.params) {
    if (request.params.tenantId) {
      return request.params.tenantId;
    }
    if (request.params.tenant) {
      return request.params.tenant;
    }
  }
  if (request.headers) {
    if (request.headers.authorization) {
      const { data } = JwtAuth.verifyToken(request.headers.authorization);
      return data.tenant ?? data.tenantId;
    }
  }
  return null;
};

const isTenantActive = async (tenantId) => {
  const tenant = await knex
    .from(MODULE.TENANT)
    .select('is_active')
    .where('id', tenantId)
    .first();
  return caseConversion.toCamelCase(tenant ?? null);
};

const appRouteScheme = 'api/v1/staff-app';
const insecureRoute = [
  `${appRouteScheme}/employee/login`,
  `${appRouteScheme}/employee/forgotPassword`,
  `${appRouteScheme}/employee/resetPassword`,
];
function secureStaffApp(fastify) {
  fastify.addHook('preValidation', async (request, reply) => {
    try {
      // if it is app route
      const tenantId = getTenantId(request);
      const { isActive } = await isTenantActive(tenantId).catch((error) =>
        reply.code(HTTP_STATUS.OK).send({
          message: error.message,
          success: false,
          code: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        })
      );
      if (isActive === undefined) {
        reply.code(HTTP_STATUS.OK).send({
          message: `tenant does not exist`,
          success: false,
          code: HTTP_STATUS.NOT_FOUND,
        });
      }
      if (!isActive) {
        reply.code(HTTP_STATUS.OK).send({
          message: `tenant trail expired`,
          success: false,
          code: HTTP_STATUS.PAYMENT_REQUIRED,
        });
      }
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

        const token = request.headers.authorization;
        if (!token) {
          const objResult = apiFailResponse(
            '403 unauthorized, please check the header.',
            null,
            HTTP_STATUS.FORBIDDEN
          );
          reply.code(HTTP_STATUS.FORBIDDEN).send(objResult);
        }
        const verificationResult = JwtAuth.verifyToken(token);
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

module.exports = { secureStaffApp };
