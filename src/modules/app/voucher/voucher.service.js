const { adminLogger: logger } = require('../../../utils/commonUtils/logger');
const MODULE = require('../../../utils/constants/moduleNames');
const adminVoucherModel = require('../../admin/voucher/voucher.model');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const promotion = async (data) => {
  let newData = { tenant: data.tenantId, appUser: data.userId };
  let vouchers = { hasError: false };
  try {
    newData = toSnakeCase(newData);
    const tempVouchers = await adminVoucherModel.promotion(newData);
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
  promotion,
};
