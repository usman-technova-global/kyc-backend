const logger = require('../../../../utils/commonUtils/logger').adminLogger;
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  apiFailResponse,
  apiSuccessResponse,
} = require('../../../../utils/commonUtil');
const Model = require('./barber.model');

const moduleName = 'Barber';

const getBarbers = async (req, res) => {
  const uriParams = {
    ...req.body,
    ...req.session,
    ...req.params,
    ...req.query,
  };
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Model.getBarbers(uriParams);
    if (data) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(
          apiSuccessResponse(
            `${moduleName} list has been fetched successfully.`,
            data
          )
        );
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Unable to fetch ${moduleName} list.`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
        Error:: ${error}
        Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Something went wrong, please try again later.`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

const gerBarbersAppointmentService = async (req, res) => {
  const uriParams = {
    ...req.body,
    ...req.session,
    ...req.params,
    ...req.query,
  };
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Model.gerBarbersAppointment(uriParams);
    if (data) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(
          apiSuccessResponse(
            `${moduleName} appointment list has been fetched successfully.`,
            data
          )
        );
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Unable to fetch ${moduleName} appointment list.`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} appointment list service.
        Error:: ${error}
        Trace:: ${error.stack}`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(
        apiFailResponse(
          `Something went wrong, please try again later.`,
          {},
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      );
  }
};

module.exports = {
  getBarbers,
  gerBarbersAppointmentService,
};
