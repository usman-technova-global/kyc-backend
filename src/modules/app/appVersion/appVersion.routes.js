const { appLogger: logger } = require('../../../utils/commonUtils/logger');

const appVersionSwagger = require('./appVersion.swagger');
const {
  apiSuccessResponse,
  apiFailResponse,
} = require('../../../utils/commonUtil');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const iosAppVersion = (fastify) => {
  fastify.get('/ios', appVersionSwagger.iosAppVersion, (req, res) => {
    logger.verbose(`Handling ${req.method} ${req.url} Route`);
    try {
      const result = { version: process.env.IOS_APP_VERSION };
      if (result) {
        logger.verbose(
          `Handling Completed With Success On ${req.method} ${req.url} Route`
        );
        res
          .status(HTTP_STATUS.OK)
          .send(
            apiSuccessResponse(
              'iOS app version has been fetched successfully.',
              result
            )
          );
      }
    } catch (error) {
      logger.verbose(
        `Handling Completed With Error On ${req.method} ${req.url} Route`
      );
      logger.error(
        `Error in calling iosAppVersion.
        Error:: ${error}
        Trace:: ${error.stack}`
      );
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .send(apiFailResponse('Getting some error', error, 'Failed'));
    }
  });
};

const androidAppVersion = (fastify) => {
  fastify.get('/android', appVersionSwagger.androidAppVersion, (req, res) => {
    logger.verbose(`Handling ${req.method} ${req.url} Route`);
    try {
      const result = { version: process.env.ANDROID_APP_VERSION };
      if (result) {
        logger.verbose(
          `Handling Completed With Success On ${req.method} ${req.url} Route`
        );
        res
          .status(HTTP_STATUS.OK)
          .send(
            apiSuccessResponse(
              'Android app version has been fetched successfully.',
              result
            )
          );
      }
    } catch (error) {
      logger.verbose(
        `Handling Completed With Error On ${req.method} ${req.url} Route`
      );
      logger.error(
        `Error in calling androidAppVersion.
        Error:: ${error}
        Trace:: ${error.stack}`
      );
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .send(apiFailResponse('Getting some error', error, 'Failed'));
    }
  });
};

const appVersionRoutes = (fastify, options, done) => {
  androidAppVersion(fastify);
  iosAppVersion(fastify);
  done();
};

module.exports = appVersionRoutes;
