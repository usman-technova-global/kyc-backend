const { v4: uuidv4 } = require('uuid');
const Model = require('./tenant.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const list = async (moduleName, logger) => {
  let tenantList = { hasError: false };
  try {
    const tenants = await Model.list();
    if (tenants) {
      tenantList = { ...tenantList, tenants };
      tenantList.message = `${moduleName} list has been fetched successfully.`;
      tenantList.code = HTTP_STATUS.OK;
    } else {
      tenantList.hasError = true;
      tenantList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      tenantList.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    tenantList.hasError = true;
    tenantList.message = error.detail;
    tenantList.code = error.code;
  }
  return caseConversion.toCamelCase(tenantList);
};

const findById = async (moduleName, id, logger) => {
  let tenant = { hasError: false };
  try {
    const tempTenants = await Model.findById(id, logger);
    if (tempTenants && tempTenants.length > 0) {
      const tempTenant = tempTenants[0];
      tenant = { ...tenant, tenant: tempTenant };
      tenant.message = `${moduleName} has been fetched successfully.`;
    } else {
      tenant.hasError = true;
      tenant.code = HTTP_STATUS.NOT_FOUND;
      tenant.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${id}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    tenant.hasError = true;
    tenant.message = error.detail;
    tenant.code = error.code;
  }
  return caseConversion.toCamelCase(tenant);
};
const create = async (moduleName, tenantData, logger) => {
  let newTenantData = tenantData;
  let tenant = { hasError: false };
  try {
    newTenantData.id = uuidv4();
    newTenantData.isActive = true;
    newTenantData.updatedBy = newTenantData.createdBy;
    newTenantData = caseConversion.toSnakeCase(newTenantData);
    const tenantResult = await Model.create(newTenantData);
    if (tenantResult && tenantResult.rowCount > 0) {
      tenant = { ...tenant, tenant: newTenantData };
      tenant.message = `${moduleName} has been created successfully.`;
    } else {
      tenant.hasError = true;
      tenant.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      tenant.message = `Unable to create ${moduleName}, please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(newTenantData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newTenantData)}`
    );
    tenant.hasError = true;
    tenant.message = error.detail;
    tenant.code = error.code;
  }

  return caseConversion.toCamelCase(tenant);
};

module.exports = {
  create,
  findById,
  list,
};
