const JwtAuth = require('./oauth');
const { apiFailResponse } = require('../commonUtil');
const { getValue, setValue } = require('../../config/redisClient');
const HTTP_STATUS = require('../constants/httpStatus');
const knex = require('../../config/databaseConnection');
const MODULE = require('../constants/moduleNames');

const appRouteScheme = 'api/v1/admin/';
const insecureRoute = [
  'api/v1/admin/backofficeUser/login',
  'api/v1/admin/backofficeUser/refresh/token',
  'api/v1/admin/backofficeUser/new-password',
  'api/v1/admin/backofficeUser/get-otp',
];

const JWTKey = async (tenant, key) => {
  const storedJWTKey = getValue(tenant, key);
  return storedJWTKey;
};

const getTenant = async (domain) => {
  const storeTenant = await getValue('domain', domain);
  if (storeTenant) {
    return storeTenant;
  }
  const systemConfig = await knex(MODULE.SYSTEM_CONFIG)
    .where('domain', domain)
    .whereNull('parent')
    .first();

  setValue('domain', domain, systemConfig.tenant);

  return systemConfig.tenant;
};

const getURL = (headers, protocol) => {
  const urlStr = headers.origin ?? headers.referer;
  let url;
  if (headers['user-agent']) {
    if (headers['user-agent']) {
      if (headers['user-agent'].includes('PostmanRuntime')) {
        url = new URL('http://localhost:3200');
      } else {
        url = new URL(urlStr);
      }
    } else {
      url = new URL(urlStr);
    }
  } else if (urlStr) {
    url = new URL(urlStr);
  } else {
    url = new URL(`${protocol}://${headers.host}`);
  }
  return url;
};

function secureAdmin(fastify) {

  fastify.addHook('onRequest', async (request, reply) => {
    try {
      console.log("-----------------hookkkk call---------------",request.url)
      console.log("-----------------appRouteScheme---------------",appRouteScheme)

      // if it is app route
      if (request.url.includes(appRouteScheme)) {
        // For insecure route, put any logic if requires
        // eslint-disable-next-line no-empty
        const found = insecureRoute.filter((route) =>
          request.url.includes(route)
        );
        console.log("found-----------",found)
        if (found.length > 0) {
          return;
        }

        // For secure routes, check the token
        // console.log('request.headers', request.headers);
        // const url = new URL(
        //   request.headers.origin ??
        //     request.headers.referer ??
        //     `http://${request.headers.host}`
        // );

        const url = getURL(request.headers, request.protocol);
        // console.log('process.env.HOST_SPLIT', process.env.HOST_SPLIT);
        // console.log(
        //   'url.hostname.split:::::',
        //   url.hostname.split('.')[process.env.HOST_SPLIT]
        // );

        const tenant = await getTenant(
          url.hostname.split('.')[process.env.HOST_SPLIT]
        );
        console.log("tenant----------",tenant)
        const token = await JWTKey(tenant, request.headers.authorization);
        // const token = request.headers.authorization;
        // const token = JWT;
        console.log("token ",token)

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
          return;
        }

        const verificationResult = await JwtAuth.verifyTokenForAdmin(token);
        console.log("verificationResult  ",verificationResult.data.role.permissions)
        if (!verificationResult.result ) {
          reply.code(HTTP_STATUS.UNAUTHORIZED).send({
            message: "permission denied!",
            success: false,
            code: HTTP_STATUS.UNAUTHORIZED,
          });
          return;
        }
       
        const permissionFound = verificationResult.data.role.permissions.filter((route) =>
          request.url.includes(route.action)
        );
        console.log("permissionFound-----------",permissionFound)
        console.log("request.url-----------",request.url)
        // if (permissionFound.length <= 0) {
        //   reply.code(HTTP_STATUS.UNAUTHORIZED).send({
        //     message: "permission denied!",
        //     success: false,
        //     code: HTTP_STATUS.UNAUTHORIZED,
        //   });
        //   return;
        // }
        
        // Set login user to the session request

        request.session = verificationResult.data;
      }
    } catch (err) {
      console.error(err)
      reply.send(err);
    }
  });
}

module.exports = { secureAdmin, getTenant };
