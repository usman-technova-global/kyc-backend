const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const appStoreEmployeeRatingModel = require('./appStoreEmployeeRating.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function getAppointmentsRatings(data) {
  let queries = data;
  let response = { hasError: false };
  try {
    queries = toSnakeCase(queries);

    const result =
      await appStoreEmployeeRatingModel.getEmployeeRatings(queries);
    if (result) {
      response = { ...response, data: result };
      response.message = `Employee Ratings fetched successfully`;
    } else {
      response.hasError = true;
      response.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      response.message = `Unable to fetch Employee Ratings`;
      logger.error(
        `Unable to fetch Employee Ratings.
        Payload:: ${prettyPrintJSON(queries)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while fetching Employee Ratings.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(queries)}`
    );
    response.hasError = true;
    response.message = error.detail;
    response.code = error.code;
  }
  return toCamelCase(response);
}

async function updateEmployeeRating(data) {
  let queries = data;
  let response = { hasError: false };
  try {
    queries = toSnakeCase(queries);
    const result =
      await appStoreEmployeeRatingModel.updateEmployeeRating(queries);
    if (result) {
      response = { ...response, data: result };
      response.message = `Employee Ratings updated successfully`;
    } else {
      response.hasError = true;
      response.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      response.message = `Unable to update Employee Ratings`;
      logger.error(
        `Unable to update Employee Ratings.
          Payload:: ${prettyPrintJSON(queries)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred while updating Employee Ratings.
          Error:: ${error}
          Trace:: ${error.stack}
          Payload:: ${prettyPrintJSON(queries)}`
    );
    response.hasError = true;
    response.message = error.detail;
    response.code = error.code;
  }
  return toCamelCase(response);
}

module.exports = {
  getAppointmentsRatings,
  updateEmployeeRating,
};
