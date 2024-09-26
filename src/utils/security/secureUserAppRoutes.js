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
  // CHECK TENANT IN QUERY STRING
  if (request.query) {
    if (request.query.tenantId) {
      return request.query.tenantId;
    }
    if (request.query.tenant) {
      return request.query.tenant;
    }
  }
  if (request.headers) {
    if (request.headers.authorization) {
      const { result, data } = JwtAuth.verifyToken(
        request.headers.authorization
      );
      if (result) {
        return data.tenantId;
      }
    }
  }

  // PENG
  if (request.headers) {
    if (request.headers.tenant) {
      return request.headers.tenant;
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

const appRouteScheme = 'api/v1/app/';
const insecureRoute = [
  'api/v1/app/config/view/',
  'api/v1/app/homemenu/list/',
  'api/v1/app/homemenu/view/',
  'api/v1/app/app-user/get-otp',
  'api/v1/app/app-user/sign-up/app',
  'api/v1/app/app-user/sign-up/driver',
  'api/v1/app/app-user/sign-in/app',
  'api/v1/app/app-user/sign-in/driver',
  'api/v1/app/app-user/forgotPassword/driver',
  'api/v1/app/app-user/resetPassword/driver',
  'api/v1/app/app-user/forgotPassword/app',
  'api/v1/app/app-user/resetPassword/app',
  'api/v1/app/app-user-device/register-device',
  'api/v1/app/appVersion/',
  'api/v1/app/appUserCart/getCart/device',
  'api/v1/app/appUserCart/updateCart',
  'api/v1/app/appOrder/stripe/webhook',
  'api/v1/app/appOrder/pay-fast/webhook',
  'api/v1/app/shop',
  'api/v1/app/rating/reviews',
  'api/v1/app/rating/distinct/star/list',
  'api/v1/app/faq/list',
  'api/v1/app/categories/list',
  'api/v1/app/categories/items/list',
  'api/v1/app/store/appointment/employee',
  'api/v1/app/store/appointment/linedUp',
  'api/v1/app/store/appointment/create',
  'api/v1/app/store/appointment/barbers',
  'api/v1/app/store/appointment/barbers/appointments',
  'api/v1/app/appointment/leave/multi-employees/management',
  'api/v1/app/appointment/leave/management',
  'api/v1/app/store/appointment/peng/create',
  'api/v1/app/store/appointment/list',
  'api/v1/app/appointment/service/category/item',
  'api/v1/app/appointment/pay-fast/access-token',
  'api/v1/app/customer/create',
];
function secure(fastify) {
  fastify.addHook('preValidation', async (request, reply) => {
    try {

     // console.log("customer body ----- ",request.body)
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
          request.session = { tenantId };
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

module.exports = { secure };
