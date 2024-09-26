const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const configModel = require('./config.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const findByTenantId = async (id) => {
  let tenant = { hasError: false };
  try {
    const tempTenants = await configModel.findByTenantId(id, logger);
    if (tempTenants && tempTenants.length > 0) {
      const tempTenant = tempTenants[0];
      tenant = { ...tenant, tenant: tempTenant };
      tenant.message = `${MODULE.TENANT_CONFIG} has been fetched successfully.`;
    } else {
      tenant.hasError = true;
      tenant.code = HTTP_STATUS.NOT_FOUND;
      tenant.message = `${MODULE.TENANT_CONFIG} does not found, please check the id.`;
      logger.error(
        `${MODULE.TENANT_CONFIG} does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.TENANT_CONFIG} does not found.
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
