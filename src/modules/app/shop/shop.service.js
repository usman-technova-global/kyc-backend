const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const shopModel = require('./shop.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const findByTenantId = async (id) => {
  let tenant = { hasError: false };
  try {
    const tempTenants = await shopModel.findByTenantId(id);
    if (tempTenants) {
      const tempTenant = tempTenants;
      tenant = { ...tenant, tenant: tempTenant };
      tenant.message = `${MODULE.TENANT} has been fetched successfully.`;
    } else {
      tenant.hasError = true;
      tenant.code = HTTP_STATUS.NOT_FOUND;
      tenant.message = `${MODULE.TENANT} does not found, please check the id.`;
      logger.error(
        `${MODULE.TENANT} does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.TENANT} does not found.
      Id:: ${id}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    tenant.hasError = true;
    tenant.message = error.detail;
    tenant.code = error.code;
  }
  return caseConversion.toCamelCase(tenant);
};

module.exports = { findByTenantId };
