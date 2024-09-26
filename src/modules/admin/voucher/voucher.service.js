const { adminLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const voucherModel = require('./voucher.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const {
  ADMIN_VOUCHER_STATUS,
} = require('../../../utils/constants/enumConstants');

const createVoucher = async (data) => {
  let newData = data;
  let vouchers = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const tempVouchers = await voucherModel.createVoucher(newData);
    if (tempVouchers) {
      vouchers = { ...vouchers, data: tempVouchers };
      vouchers.message = `Vouchers have been created successfully.`;
    } else {
      vouchers.hasError = true;
      vouchers.code = HTTP_STATUS.NOT_FOUND;
      vouchers.message = `Unable to create ${MODULE.ADMIN.VOUCHER}. please check the payload.`;
      logger.error(
        `Unable to create ${MODULE.ADMIN.VOUCHER}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.ADMIN.VOUCHER} unable to create vouchers.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    vouchers.hasError = true;
    vouchers.message = error.detail;
    vouchers.code = error.code;
  }
  return toCamelCase(vouchers);
};

const getVoucher = async (data) => {
  let vouchers = { hasError: false };
  try {
    const tempVouchers = await voucherModel.getVoucher(data);
    if (tempVouchers && tempVouchers.result.length > 0) {
      vouchers = { ...vouchers, data: tempVouchers };
      vouchers.message = `Vouchers have been fetched successfully.`;
    } else {
      vouchers.hasError = true;
      vouchers.code = HTTP_STATUS.OK;
      vouchers.message = `Vouchers list is empty.`;
      logger.error(
        `${MODULE.ADMIN.VOUCHER} does not found.
        TenantId:: ${data.tenant}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.ADMIN.VOUCHER} does not found.
      TenantId:: ${data.tenant}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    vouchers.hasError = true;
    vouchers.message = error.detail;
    vouchers.code = error.code;
  }
  return toCamelCase(vouchers);
};

const updateVoucher = async (data) => {
  let newData = data;
  let vouchers = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const tempVouchers = await voucherModel.updateVoucher(newData);
    if (tempVouchers) {
      vouchers = { ...vouchers, data: tempVouchers };
      vouchers.message = `Voucher have been updated successfully.`;
    } else {
      vouchers.hasError = true;
      vouchers.code = HTTP_STATUS.NOT_FOUND;
      vouchers.message = `Unable to update ${MODULE.ADMIN.VOUCHER}. please check the payload.`;
      logger.error(
        `Unable to update ${MODULE.ADMIN.VOUCHER}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.ADMIN.VOUCHER} unable to update voucher.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    vouchers.hasError = true;
    vouchers.message = error.detail;
    vouchers.code = error.code;
  }
  return toCamelCase(vouchers);
};

const deleteVoucher = async (data) => {
  let newData = data;
  let vouchers = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const tempVouchers = await voucherModel.deleteVoucher(newData);
    if (tempVouchers > 0) {
      vouchers = { ...vouchers };
      vouchers.message = `Voucher have been deleted successfully.`;
    } else {
      vouchers.hasError = true;
      vouchers.code = HTTP_STATUS.NOT_FOUND;
      vouchers.message = `Unable to delete ${MODULE.ADMIN.VOUCHER}. please check the payload.`;
      logger.error(
        `Unable to delete ${MODULE.ADMIN.VOUCHER}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.ADMIN.VOUCHER} unable to delete voucher.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    vouchers.hasError = true;
    vouchers.message = error.detail;
    vouchers.code = error.code;
  }
  return toCamelCase(vouchers);
};

const updateStatus = async (data) => {
  let newData = data;
  let vouchers = { hasError: false };
  try {
    newData.updatedDate = new Date();
    let status = ADMIN_VOUCHER_STATUS.INACTIVE;
    if (newData.isActive) status = ADMIN_VOUCHER_STATUS.ACTIVE;
    newData.status = status;
    newData = toSnakeCase(newData);
    const tempVouchers = await voucherModel.updateVoucher(newData);
    if (tempVouchers && Object.keys(tempVouchers).length > 0) {
      vouchers.item = newData;
      vouchers = { ...vouchers };
      vouchers.message = `Voucher have been status updated successfully.`;
    } else {
      vouchers.hasError = true;
      vouchers.code = HTTP_STATUS.NOT_FOUND;
      vouchers.message = `Unable to status update ${MODULE.ADMIN.VOUCHER}. please check the payload.`;
      logger.error(
        `Unable to status update ${MODULE.ADMIN.VOUCHER}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.ADMIN.VOUCHER} unable to status update voucher.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    vouchers.hasError = true;
    vouchers.message = error.detail;
    vouchers.code = error.code;
  }
  return toCamelCase(vouchers);
};

const promotion = async (data) => {
  let newData = data;
  let vouchers = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const tempVouchers = await voucherModel.promotion(newData);
    if (tempVouchers) {
      vouchers.items = tempVouchers;
      vouchers = { ...vouchers };
      vouchers.message = `Voucher have been get successfully.`;
    } else {
      vouchers.hasError = true;
      vouchers.code = HTTP_STATUS.NOT_FOUND;
      vouchers.message = `Unable to get ${MODULE.ADMIN.VOUCHER}. please check the payload.`;
      logger.error(
        `Unable to get ${MODULE.ADMIN.VOUCHER}.
        Payload:: ${prettyPrintJSON(newData)}`
      );
    }
  } catch (error) {
    logger.error(
      `${MODULE.ADMIN.VOUCHER} unable to get voucher.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newData)}`
    );
    vouchers.hasError = true;
    vouchers.message = error.detail;
    vouchers.code = error.code;
  }
  return toCamelCase(vouchers);
};

module.exports = {
  createVoucher,
  getVoucher,
  updateVoucher,
  deleteVoucher,
  updateStatus,
  promotion,
};
