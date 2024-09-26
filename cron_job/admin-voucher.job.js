const moment = require('moment');
const knex = require('../src/config/databaseConnection');
const {
  ADMIN_VOUCHER_STATUS,
} = require('../src/utils/constants/enumConstants');

const expiredVoucher = async () => {
  const findResult = await knex.raw(
    `select id from admin_voucher where status=:status and valid_till::date < date(:currentDate)`,
    {
      status: ADMIN_VOUCHER_STATUS.ACTIVE,
      currentDate: moment().format('YYYY-MM-DD'),
    }
  );

  const voucherIds = [];
  if (findResult.rows && findResult.rows.length > 0) {
    findResult.rows.forEach((item) => voucherIds.push(item.id));
    const voucherQuery = knex('admin_voucher')
      .update({ is_active: false, status: ADMIN_VOUCHER_STATUS.EXPIRED })
      .whereIn('id', voucherIds);

    Promise.all([voucherQuery]);
  }
};

module.exports = {
  expiredVoucher,
};
