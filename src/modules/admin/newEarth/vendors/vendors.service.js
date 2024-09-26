const Vendor = require('./vendors.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
// const {
//   prettyPrintJSON,
// } = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const fetchVendors = async (module, req, res, logger) => {
  const result = { hasError: false };

  try {
    const vendors = await Vendor.get({
      ...req.params,
      ...req.session,
      ...req.query,
    });
    if (!vendors) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${module} list.`;
      logger.error(`Unable to fetch ${module} list`);
    }
    result.items = vendors;
    result.message = `${module} list has been fetched successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch list ${module} list.
            Error:: ${error}
            Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const fetchVendorsLov = async (module, req, res, logger) => {
  const result = { hasError: false };

  try {
    const vendors = await Vendor.getLov({ ...req.params, ...req.session });
    if (!vendors) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${module} list.`;
      logger.error(`Unable to fetch ${module} list`);
    }
    result.items = vendors;
    result.message = `${module} list has been fetched successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch list ${module} list.
            Error:: ${error}
            Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const find = async (module, req, res, logger) => {
  const result = { hasError: false };

  try {
    const vendors = await Vendor.getById(req.params.id);
    if (!vendors) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${module}.`;
      logger.error(`Unable to fetch ${module} `);
    }
    result.items = vendors;
    result.message = `${module}  has been fetched successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch  ${module}.
            Error:: ${error}
            Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const create = async (module, req, res, logger) => {
  const result = { hasError: false };

  try {
    const vendors = await Vendor.create({ ...req.body, ...req.session });
    if (!vendors) {
      result.hasError = true;
      result.code = HTTP_STATUS.BAD_REQUEST;
      result.message = `Unable to create ${module}.`;
      logger.error(`Unable to create ${module} `);
    }
    result.items = vendors;
    result.message = `${module}  has been created successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to create ${module}.
            Error:: ${error}
            Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const update = async (module, req, res, logger) => {
  const result = { hasError: false };

  try {
    const vendors = await Vendor.update(req.params.id, {
      ...req.body,
      ...req.session,
    });
    if (!vendors) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${module}.`;
      logger.error(`Unable to update ${module} `);
    }
    result.items = vendors;
    result.message = `${module}  has been updated successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to update  ${module}.
            Error:: ${error}
            Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const remove = async (module, req, res, logger) => {
  const result = { hasError: false };

  try {
    const vendors = await Vendor.remove(req.body.id, req);
    if (!vendors) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete ${module}.`;
      logger.error(`Unable to deleted ${module} `);
    }
    result.items = {};
    result.message = `${module}  has been deleted successfully.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to delete  ${module}.
            Error:: ${error}
            Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = {
  fetchVendors,
  fetchVendorsLov,
  find,
  create,
  update,
  remove,
};
