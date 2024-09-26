const knex = require('../../../../config/databaseConnection');
const {
  APP_ORDER_STATUS,
  ORDER_PAYMENT_TYPE,
  TRANSACTION_TYPE,
} = require('../../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const MODULE = require('../../../../utils/constants/moduleNames');

const create = async (data) => {
  const transaction = await knex.transaction();

  const appOrder = await transaction(MODULE.APP.ORDER)
    .where('id', data.app_order)
    .first();

  const appOrderDelivery = await transaction
    .from(MODULE.APP.ORDER_DELIVERY)
    .select('*')
    .where('app_order', data.app_order)
    .first();

  // console.log('data::::::::', data, appOrder, appOrderDelivery);
  // return;

  let orderStatus = await transaction(MODULE.APP.ORDER_STATUSES)
    .select('*')
    .where({ app_order: data.app_order, status: data.status })
    .first();

  if (!orderStatus) {
    [orderStatus] = await transaction(MODULE.APP.ORDER_STATUSES)
      .insert({
        app_order: data.app_order,
        status: data.status,
        app_user: data.app_user,
      })
      .returning('*');
  }

  const orderUpdateData = {
    status: data.status,
    updated_date: new Date(),
  };

  const order = await transaction(MODULE.APP.ORDER)
    .update(orderUpdateData)
    .where('id', data.app_order);

  if (!order) {
    await transaction.rollback();
    const newError = new Error(`No Order Status update`);
    newError.detail = `App order status is not updated`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  if (appOrderDelivery) {
    await transaction(MODULE.APP.ORDER_DELIVERY_STATUSES).insert({
      app_order_delivery: appOrderDelivery.id,
      app_user: appOrderDelivery.app_user,
      app_order: appOrderDelivery.app_order,
      created_by: data.created_by,
      status: data.status,
    });

    await transaction
      .from(MODULE.APP.ORDER_DELIVERY)
      .update({
        status: data.status,
      })
      .where('app_order', data.app_order);

    if (
      data.status === APP_ORDER_STATUS.COMPLETED &&
      appOrder.payment_type === ORDER_PAYMENT_TYPE.CASH_ON_DELIVERY
    ) {
      const findWallet = await knex(MODULE.WALLETS)
        .where('app_user', appOrderDelivery.app_user)
        .first();

      const balance = Number(findWallet.balance) - Number(data.balance);
      const [wallets] = await transaction(MODULE.WALLETS)
        .update({ balance })
        .where('app_user', appOrderDelivery.app_user)
        .returning('*');

      if (!wallets) {
        await transaction.rollback();
        const newError = new Error(`No driver amount is update`);
        newError.detail = `No driver amount is update`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      const [walletTransactions] = await transaction(MODULE.WALLET_TRANSCATIONS)
        .insert({
          wallets: wallets.id,
          type: TRANSACTION_TYPE.DEBIT,
          amount: Number(data.balance),
          reference_id: data.app_order,
        })
        .returning('*');
      if (!walletTransactions) {
        await transaction.rollback();
        const newError = new Error(`No driver transaction is created`);
        newError.detail = `No driver transaction is created`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }
  }

  const commit = await transaction.commit();
  if (commit.response.rowCount !== null) {
    await transaction.rollback();
    const newError = new Error(`Commit`);
    newError.detail = `Commit service is not execute`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  return orderStatus;
};

const findStatusByAppOrderId = async (data) => {
  const columns = ['id', 'app_order', 'status'];
  return knex
    .select(columns)
    .from(MODULE.APP.ORDER_STATUSES)
    .where('app_order', data.app_order)
    .andWhere('status', data.status);
};

module.exports = { create, findStatusByAppOrderId };
