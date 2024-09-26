const knex = require('../../../config/databaseConnection');
const {
  ADMIN_VOUCHER_STATUS,
} = require('../../../utils/constants/enumConstants');
const MODULE = require('../../../utils/constants/moduleNames');

const createVoucher = async (data) => {
  const column = [
    'id',
    'discount_type',
    'valid_from',
    'valid_till',
    'value',
    'min_amount',
    'redeem_count',
    'max_redeem',
    'type',
    'voucher_code',
    'tenant',
    'created_by',
    'created_date',
    'updated_by',
    'updated_date',
    'status',
    'is_active',
    'is_unlimited_redeem',
    'max_user_redeem',
    'is_deleted',
  ];
  const [result] = await knex
    .from(MODULE.ADMIN.VOUCHER)
    .insert(data)
    .returning(column);

  return result;
};

const getVoucher = async (data) => {
  const column = [
    'id',
    'discount_type',
    'valid_from',
    'valid_till',
    'value',
    'min_amount',
    'redeem_count',
    'max_redeem',
    'type',
    'voucher_code',
    'tenant',
    'created_by',
    'created_date',
    'updated_by',
    'updated_date',
    'status',
    'is_active',
    'is_unlimited_redeem',
    'max_user_redeem',
    'is_deleted',
  ];
  const getQuery = knex
    .from(MODULE.ADMIN.VOUCHER)
    .andWhere('tenant', data.tenant)
    .andWhere('is_deleted', false);
  if (data.search) {
    getQuery.andWhereILike('voucher_code', `%${data.search}%`);
  }

  const totalQuery = getQuery.clone();

  const result = await getQuery
    .select(column)
    .orderBy([
      { column: 'valid_till', order: 'asc' },
      { column: 'created_date', order: 'desc' },
    ])
    .offset(data.offset)
    .limit(data.limit);

  const [totalResult] = await totalQuery.count();

  let page = 0;
  if (totalResult.count > 0) {
    page = Math.ceil(data.offset / data.limit) + 1;
  }

  return {
    result,
    page,
    perPage: data.limit,
    totalPages: Math.ceil(totalResult.count / data.limit),
    totalResults: Number(totalResult.count),
  };
};

const updateVoucher = async (data) => {
  const column = [
    'id',
    'discount_type',
    'valid_from',
    'valid_till',
    'value',
    'min_amount',
    'redeem_count',
    'max_redeem',
    'type',
    'voucher_code',
    'tenant',
    'updated_by',
    'updated_date',
    'status',
    'is_active',
    'is_unlimited_redeem',
    'max_user_redeem',
    'is_deleted',
  ];
  const [result] = await knex
    .from(MODULE.ADMIN.VOUCHER)
    .where('id', data.id)
    .update(data)
    .returning(column);

  return result;
};

const deleteVoucher = async (data) => {
  const deleteCount = await knex
    .from(MODULE.ADMIN.VOUCHER)
    .where('id', data.id)
    .update({ is_deleted: true });
  return deleteCount;
};

const promotion = async (data) => {
  const vouchers = await knex(MODULE.ADMIN.VOUCHER)
    .where({
      tenant: data.tenant,
      status: ADMIN_VOUCHER_STATUS.ACTIVE,
    })
    .orderBy([
      { column: 'valid_till', order: 'asc' },
      { column: 'created_date', order: 'desc' },
    ]);
  // const vouchers = await knex(MODULE.ADMIN.VOUCHER).where({
  //   tenant: data.tenant,
  //   status: ADMIN_VOUCHER_STATUS.ACTIVE,
  // });
  const newArr = [];
  if (vouchers && vouchers.length) {
    await Promise.all(
      vouchers.map(async (item) => {
        let userCount = 1;

        if (item.is_unlimited_redeem) {
          userCount = item.max_user_redeem;
        } else if (item.redeem_count >= item.max_redeem) {
          await knex(MODULE.ADMIN.VOUCHER)
            .update({ status: ADMIN_VOUCHER_STATUS.EXPIRED })
            .where('id', item.id);

          return false;
        }

        const voucherHistory = await knex(MODULE.ADMIN.VOUCHER_HISTORY).where({
          tenant: data.tenant,
          admin_voucher: item.id,
          app_user: data.app_user,
        });
        if (voucherHistory.length >= userCount) {
          return false;
        }
        newArr.push(item);
        return item;
      })
    );
  }

  return newArr;
};

module.exports = {
  createVoucher,
  getVoucher,
  updateVoucher,
  deleteVoucher,
  promotion,
};
