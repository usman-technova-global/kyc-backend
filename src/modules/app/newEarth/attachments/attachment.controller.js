const logger = require('../../../../utils/commonUtils/logger').adminLogger;
// const caseConversion = require('../../../../utils/commonUtils/caseConversion');

const {
  apiSuccessResponse,
  apiFailResponse,
  // validationError
} = require('../../../../utils/commonUtil');

const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const Service = require('./attachment.service');

const moduleName = 'Project Attachment';

const List = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.attachmentList(
      moduleName,
      { ...req.query, ...req.params },
      req.session,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = {
  List,
};
