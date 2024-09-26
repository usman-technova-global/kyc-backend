const JwtAuth = require('./oauth');
const { apiResponse } = require('../commonUtil');
// const { roleMenu } = require('../rolemenuconstant');
const backOfficeUserModel = require('../../modules/admin/backofficeUser/backofficeUser.model');
const HTTP_STATUS = require('../constants/httpStatus');
//  const logger = require('../../utils/commonUtils/logger').adminLogger;

const insecureRoutes = [
  '/api/v1/admin/adminAccount/signIn',
  '/android/version',
  '/ios/version',
  //  "/api/v1/rolePermission/role/addrole",
  //  "/rolePermission/rolePerm/addrolepermission",
  // "/api/v1/rolePermission/userAdmin/addUserByAdmin",
  // "/api/v1/rolePermission/userAdmin/adminLogin",
  // "/api/v1/rolePermission/rolePerm/updaterolepermission",
  // "/api/v1/rolePermission/rolePerm/viewRolePermByRole",
  // "/api/v1/admin/adminAccount/userLising",
  // "/api/v1/admin/adminAccount/userCreate",
  // "/api/v1/admin/adminAccount/userUpdate",
  // "/api/v1/admin/adminAccount/userView",
  // "/api/v1/rolePermission/rolePerm/viewRolePermByRole"
];
function isValidRequest(fastify) {
  return new Promise((resolve, reject) => {
    fastify.addHook('onRequest', async (request, reply) => {
      try {
        console.log("jsdfijskdfhuwhldkhsakjhdfkHLQIDUHWUIEHRIUEIRHIU")
        const found = insecureRoutes.filter((route) =>
          request.url.includes(route)
        );

        if (found.length > 0) {
          // do in case of insecure route
        } else {
          const decode = JwtAuth.verifyToken(request, reply);
          const permissions =
            decode.payload || decode.payload !== undefined
              ? decode.payload.permission
              : null;
          const userDetail =
            decode.payload || decode.payload !== undefined
              ? decode.payload.user
              : null;
          //  force fully logout check
          if (!userDetail) {
            return reply
              .code(HTTP_STATUS.UNAUTHORIZED)
              .send(
                apiResponse(
                  HTTP_STATUS.UNAUTHORIZED,
                  false,
                  'Permission denied',
                  null,
                  'ERROR'
                )
              );
          }
          const user = await backOfficeUserModel.findUserById();
          if (user) {
            return reply
              .code(HTTP_STATUS.UNAUTHORIZED)
              .send(
                apiResponse(
                  HTTP_STATUS.UNAUTHORIZED,
                  false,
                  'Permission denied',
                  null,
                  'ERROR'
                )
              );
          }

          if (permissions && permissions.length > 0) {
            // let urlRequest="";
            // let slash = "/";

            // let splitUrl = [] = request.url.split("/");
            //   for(let i = 0; i < 6; i++){
            //     if(i<6 && i>0){

            //      let urlRequestMapper = slash + splitUrl[i];
            //      urlRequest = urlRequest + urlRequestMapper
            //     }
            //   }

            const foundPermission = permissions.filter((route) =>
              request.url.includes(route.url)
            );
            request.user = userDetail;
            request.email = userDetail.email;

            request.name = `${userDetail.firstName} ${userDetail.lastName}`;
            if (!foundPermission || foundPermission.length <= 0) {
              return reply
                .code(HTTP_STATUS.UNAUTHORIZED)
                .send(
                  apiResponse(
                    HTTP_STATUS.UNAUTHORIZED,
                    false,
                    'Permission denied',
                    null,
                    'ERROR'
                  )
                );
            }
          }
        }
        resolve();
        /**/
      } catch (err) {
        reject(err);
        reply.send(err);
      }
      return null;
    });
  });
}

module.exports = { isValidRequest };
