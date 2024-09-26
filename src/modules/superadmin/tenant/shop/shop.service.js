/* eslint-disable spaced-comment */
const Model = require('./shop.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const roleModel = require('../../role/role.model');
const { newEmail } = require('../../../email/email.service');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const { hashAsync } = require('../../../../utils/security/bcrypt');

const tenantList = async (moduleName, param, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await Model.count();
    const tenants = await Model.tenantList(param);
    if (tenants) {
      result.items.total = parseInt(total[0].count, 10);
      result.items.list = tenants;
      result = { ...result };
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const search = async (moduleName, param, logger) => {
  const result = { hasError: false, items: { list: [], total: 0 } };
  try {
    const total = await Model.countWithSearch(param);
    const dataList = await Model.search(param);
    if (dataList) {
      result.items.list = dataList;
      result.items.total = parseInt(total.rows[0].count, 10);
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch order list.`;
      logger.error(`Unable to fetch order list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list order list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const insert = async (moduleName, tenantData, logger) => {
  let newTenantData = tenantData;
  let tenant = { hasError: false };
  // newEmail('Email', '3c5b9acd-0deb-4b18-9a91-11bbac1a0367', logger)
  try {
    if (newTenantData.trialMode) {
      newTenantData.trialStartDate = new Date();
    } else {
      newTenantData.trialStartDate = null;
    }
    newTenantData = caseConversion.toSnakeCase(newTenantData);
    const newPassword = await hashAsync('123');
    const tenantResult = await Model.insert(newTenantData, newPassword);
    if (tenantResult && tenantResult.success) {
      const tenantId = tenantResult.inserted_ids.tenant;
      const userId = tenantResult.inserted_ids.backoffice_user;
      const tenantReturnData = await Model.findByTenantId(tenantId);
      // const txt = { config: "https://lundry-app-admin.s3.ca-central-1.amazonaws.com/config/devwebapp.urapptech.com.json" };
      // TODO: nginx configuration is not implemented for sub domains
      if (tenantReturnData && Object.keys(tenantReturnData)) {
        // const configJson = { tenant: tenantReturnData.id };
        // if (newTenantData.live_domain) {
        //   const buf = Buffer.from(JSON.stringify(configJson));
        //   const liveConfigFile = {
        //     Key: `config/${newTenantData.live_domain}.${DOMAIN_PREFIX}.json`,
        //     Body: buf,
        //     ContentEncoding: 'base64',
        //     ContentType: 'application/json',
        //   };
        //   await uploader.uploadToAdminBucket(liveConfigFile);
        // }
        // if (newTenantData.development_domain) {
        //   const buf = Buffer.from(JSON.stringify(configJson));
        //   const developmentConfigFile = {
        //     Key: `config/${newTenantData.development_domain}.${DOMAIN_PREFIX}.json`,
        //     Body: buf,
        //     ContentEncoding: 'base64',
        //     ContentType: 'application/json',
        //   };
        //   await uploader.uploadToAdminBucket(developmentConfigFile);
        // }

        tenant = { ...tenant, tenant: tenantReturnData };
        const emailSent = await newEmail('Email', userId, logger);
        tenant.message = `${moduleName} has been created successfully. ${emailSent}`;
        tenant.code = HTTP_STATUS.OK;
      } else {
        tenant.hasError = true;
        tenant.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        tenant.message = `Unable to create ${moduleName}, please check the payload.`;
        logger.error(
          `Unable to create ${moduleName}.
        Payload:: ${prettyPrintJSON(newTenantData)}`
        );
      }
    } else {
      tenant.hasError = true;
      tenant.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      tenant.message = `Tenant is not created`;
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

const update = async (moduleName, tenantId, tenantData, logger) => {
  let newTenantData = tenantData;
  let result = { hasError: false };
  try {
    newTenantData = caseConversion.toSnakeCase(newTenantData);
    const updateResult = await Model.update(newTenantData, tenantId);
    if (updateResult) {
      const findSystemConfig = await Model.findSystemConfigByTenant(tenantId);

      //const configJson = { tenant: newTenantData.id };
      // if (
      //   newTenantData.live_domain &&
      //   findResult.tenant_config.live_domain !== newTenantData.live_domain
      // ) {
      //   const buf = Buffer.from(JSON.stringify(configJson));
      //   const liveConfigFile = {
      //     Key: `config/${newTenantData.live_domain}.${DOMAIN_PREFIX}.json`,
      //     Body: buf,
      //     ContentEncoding: 'base64',
      //     ContentType: 'application/json',
      //   };
      //   await uploader.uploadToAdminBucket(liveConfigFile);
      // }
      // if (
      //   newTenantData.development_domain &&
      //   findResult.tenant_config.development_domain !==
      //     newTenantData.development_domain
      // ) {
      //   const buf = Buffer.from(JSON.stringify(configJson));
      //   const developmentConfigFile = {
      //     Key: `config/${newTenantData.development_domain}.${DOMAIN_PREFIX}.json`,
      //     Body: buf,
      //     ContentEncoding: 'base64',
      //     ContentType: 'application/json',
      //   };
      //   await uploader.uploadToAdminBucket(developmentConfigFile);
      // }

      delete newTenantData.trialUpdateMode;
      newTenantData.isActive = findSystemConfig.tenant.is_active;
      newTenantData.theme = findSystemConfig.theme;
      result = { ...result, item: newTenantData };
      result.message = `${moduleName} has been updated successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}, please check the payload.`;
      logger.error(
        `Unable to update ${moduleName}.
          Payload:: ${prettyPrintJSON(newTenantData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newTenantData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const detail = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await Model.tenantDetail(id, logger);
    if (getResult && Object.keys(getResult).length > 0) {
      const tempData = getResult;
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};
const detailUser = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await Model.tenantDetailUser(id, logger);
    if (getResult && Object.keys(getResult).length > 0) {
      const tempData = getResult[0];
      result = { ...result, item: tempData };
      result.message = `${moduleName} user has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} user does not found, please check the id.`;
      logger.error(
        `${moduleName} user does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} user does not found.
      Id:: ${id}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};
const detailCategory = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await Model.tenantDetailCategory(id, logger);
    if (getResult && Object.keys(getResult).length > 0) {
      const tempData = getResult;
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};
const findByTenantId = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const tempTenants = await Model.findByTenantId(id, logger);
    if (tempTenants && Object.keys(tempTenants).length > 0) {
      const tempTenant = tempTenants;
      const roles = await roleModel.getRoles();
      if (roles) {
        tempTenant.roles = roles;
      } else {
        tempTenant.roles = [];
      }
      result = { ...result, item: tempTenant };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const ownerDetail = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const tempTenants = await Model.ownerDetail(id, logger);
    if (tempTenants && Object.keys(tempTenants).length > 0) {
      const tempTenant = tempTenants;
      result = { ...result, item: tempTenant };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const branchDetail = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const tempTenants = await Model.tenantDetail(id, logger);
    if (tempTenants && Object.keys(tempTenants).length > 0) {
      const tempTenant = tempTenants;
      result = { ...result, item: tempTenant };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const updateStatus = async (moduleName, tenantId, tenantData, logger) => {
  let newTenantData = tenantData;
  let result = { hasError: false };
  try {
    newTenantData = caseConversion.toSnakeCase(newTenantData);
    const findResult = await Model.findById(tenantId);
    if (findResult && findResult.length > 0) {
      const tempData = findResult[0];
      const updateResult = await Model.updateStatus(tenantId, newTenantData);
      if (updateResult) {
        newTenantData.id = tempData.id;
        result = { ...result, item: newTenantData };
        result.message = `${moduleName} has been updated successfully.`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to update ${moduleName}, please check the payload.`;
        logger.error(
          `Unable to update ${moduleName}.
        Payload:: ${prettyPrintJSON(newTenantData)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}, please check the payload.`;
      logger.error(
        `Unable to update ${moduleName}.
        Payload:: ${prettyPrintJSON(newTenantData)}`
      );
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newTenantData)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const edit = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const tempTenants = await Model.editTenant(id, logger);
    if (tempTenants && Object.keys(tempTenants).length > 0) {
      const tempTenant = tempTenants;
      const roles = await roleModel.getRoles();
      if (roles) {
        tempTenant.roles = roles;
      } else {
        tempTenant.roles = [];
      }
      result = { ...result, item: tempTenant };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const branchDetailUser = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await Model.tenantBranchDetailUser(id, logger);
    if (getResult) {
      const tempData = getResult;
      result = { ...result, item: tempData };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
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
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

module.exports = {
  insert,
  tenantList,
  search,
  detail,
  detailUser,
  detailCategory,
  findByTenantId,
  update,
  updateStatus,
  ownerDetail,
  branchDetail,
  edit,
  branchDetailUser,
};
