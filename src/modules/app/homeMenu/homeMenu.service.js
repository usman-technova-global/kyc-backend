const homeMenuModel = require('./homeMenu.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const listByTenantId = async (moduleName, id, logger) => {
  let menu = { hasError: false };
  try {
    const tempTenants = await homeMenuModel.listByTenantId(id);
    if (tempTenants && tempTenants.length > 0) {
      menu = { ...menu, menu: tempTenants };
      menu.message = `${moduleName} has been fetched successfully.`;
    } else {
      menu.hasError = true;
      menu.code = HTTP_STATUS.NOT_FOUND;
      menu.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${id}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    menu.hasError = true;
    menu.message = error.detail;
    menu.code = error.code;
  }
  return caseConversion.toCamelCase(menu);
};

const viewByTenantIdAndMenuId = async (moduleName, id, menuId, logger) => {
  let menu = { hasError: false };
  try {
    let uriParams = {
      id,
      menuId,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const tempTenants = await homeMenuModel.viewByTenantIdAndMenuId(uriParams);
    if (tempTenants && tempTenants.length > 0) {
      menu = { ...menu, menu: tempTenants };
      menu.message = `${moduleName} detail has been fetched successfully.`;
    } else {
      menu.hasError = true;
      menu.code = HTTP_STATUS.NOT_FOUND;
      menu.message = `${moduleName} detail does not found, please check the id.`;
      logger.error(
        `${moduleName} detail does not found.
        Id:: ${id}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} detail does not found.
      Id:: ${id}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    menu.hasError = true;
    menu.message = error.detail;
    menu.code = error.code;
  }
  return caseConversion.toCamelCase(menu);
};

const viewByTenantIdAndMenuIdAndSubmenuId = async (
  moduleName,
  tenantId,
  menuId,
  submenuId,
  logger
) => {
  let menu = { hasError: false };
  try {
    let uriParams = {
      tenantId,
      menuId,
      submenuId,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const tempTenants = await homeMenuModel.viewSubmenuByTenantIdAndMenuId(
      uriParams
    );
    if (tempTenants && tempTenants.length > 0) {
      menu = { ...menu, menu: tempTenants };
      menu.message = `${moduleName} detail has been fetched successfully.`;
    } else {
      menu.hasError = true;
      menu.code = HTTP_STATUS.NOT_FOUND;
      menu.message = `${moduleName} submenu does not found, please check the id.`;
      logger.error(
        `${moduleName} detail does not found.
        Id:: ${uriParams.menuId}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} submenu does not found.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    menu.hasError = true;
    menu.message = error.detail;
    menu.code = error.code;
  }
  return caseConversion.toCamelCase(menu);
};
module.exports = {
  listByTenantId,
  viewByTenantIdAndMenuId,
  viewByTenantIdAndMenuIdAndSubmenuId,
};
