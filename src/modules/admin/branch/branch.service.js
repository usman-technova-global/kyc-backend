const Model = require('./branch.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const shopModel = require('../../superadmin/tenant/shop/shop.model');
const { newEmail } = require('../../email/email.service');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { hashAsync } = require('../../../utils/security/bcrypt');

const list = async (moduleName, param, logger) => {
  let result = {
    hasError: false,
    items: {
      list: [],
      total: 0,
      totalEmployees: 0,
      totalEmployeeLimitCounts: 0,
    },
  };
  try {
    const total = await Model.count(param);
    const totalEmployeeCounts = await Model.employeeCounts(param.tenant);
    const totalEmployeeLimitCounts = await Model.employeeLimitCounts(
      param.tenant
    );
    const tenants = await Model.list(param);
    if (tenants) {
      result.items.total = parseInt(total[0].count, 10);
      result.items.totalEmployees = parseInt(totalEmployeeCounts[0].count, 10);
      result.items.totalEmployeeLimitCounts = parseInt(
        totalEmployeeLimitCounts[0].sum,
        10
      );
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
      result.items.list = dataList.rows;
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

const detail = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await Model.detail(id, logger);
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

const setting = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await shopModel.tenantDetailConfig(id, logger);
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

const category = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const getResult = await shopModel.tenantDetailCategory(id, logger);
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

const insert = async (moduleName, tenantId, tenantData, logger) => {
  let newTenantData = tenantData;
  let result = { hasError: false };
  try {
    const tenant = await shopModel.findById(tenantId);
    if (tenant && tenant.length > 0) {
      const checkBranchLimit = await shopModel.checkBranchLimit(tenantId);
      if (checkBranchLimit) {
        newTenantData = caseConversion.toSnakeCase(newTenantData);
        const newPassword = await hashAsync('123');
        const tenantResult = await Model.insert(
          tenantId,
          newTenantData,
          newPassword
        );
        if (tenantResult && tenantResult.success) {
          const newTenantId = tenantResult.inserted_ids.tenant;
          const userId = tenantResult.inserted_ids.backoffice_user;
          const tenantReturnData = await shopModel.findByTenantId(newTenantId);
          // const txt = { config: "https://lundry-app-admin.s3.ca-central-1.amazonaws.com/config/devwebapp.urapptech.com.json" };
          // TODO: nginx configuration is not implemented for sub domains

          if (tenantReturnData) {
            // const configJson = { tenant: newTenantId };
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
            result = { ...result, tenant: tenantReturnData };
            const emailSent = await newEmail('Email', userId, logger);
            result.message = `${moduleName} has been created successfully. ${emailSent}`;
            result.code = HTTP_STATUS.OK;
          } else {
            result.hasError = true;
            result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
            result.message = `Unable to create ${moduleName}, please check the payload.`;
            logger.error(
              `Unable to create ${moduleName}.
            Payload:: ${prettyPrintJSON(newTenantData)}`
            );
          }
        } else {
          result.hasError = true;
          result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
          result.message = `${tenantResult.message}`;
          logger.error(
            `Unable to create ${moduleName}.
            Payload:: ${prettyPrintJSON(newTenantData)}`
          );
        }
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to create ${moduleName}, Branch limit has been exceeded.`;
        logger.error(`Create branch limit has been exceeded`);
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}, tenant is not found.`;
      logger.error(` tenant is not found`);
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
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
    const tempTenants = await shopModel.editTenant(id, logger);
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

const update = async (moduleName, id, tenantData, logger) => {
  let newTenantData = tenantData;
  let result = { hasError: false };
  try {
    const findResult = await shopModel.findByTenantId(id);
    if (findResult && Object.keys(findResult).length > 0) {
      newTenantData.updated_date = new Date();
      newTenantData = caseConversion.toSnakeCase(newTenantData);
      const updateResult = await Model.update(newTenantData, id);
      if (updateResult) {
        newTenantData.id = findResult.id;
        // const configJson = { tenant: id };
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
        newTenantData.isActive = findResult.is_active;
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

const updateStatus = async (moduleName, tenantId, tenantData, logger) => {
  let newTenantData = tenantData;
  let result = { hasError: false };
  try {
    newTenantData = caseConversion.toSnakeCase(newTenantData);
    const findResult = await shopModel.findById(tenantId);
    if (findResult && findResult.length > 0) {
      const tempData = findResult[0];
      const updateResult = await Model.updateStatus(tenantId, newTenantData);
      if (updateResult) {
        newTenantData.id = tempData.id;
        newTenantData.trial_mode = newTenantData.is_active;
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

module.exports = {
  list,
  search,
  detail,
  setting,
  category,
  insert,
  edit,
  update,
  updateStatus,
};
