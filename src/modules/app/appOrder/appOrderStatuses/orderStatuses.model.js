const knex = require('../../../../config/databaseConnection');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const MODULE = require('../../../../utils/constants/moduleNames');

const create = async (data) => {
  const transaction = await knex.transaction();

  const appOrder = transaction(MODULE.APP.ORDER)
    .where('id', data.app_order)
    .first();

  let orderStatus = await transaction(MODULE.APP.ORDER_STATUSES)
    .select('*')
    .where({ app_order: data.app_order, status: data.status })
    .first();

  if (!orderStatus) {
    [orderStatus] = await transaction(MODULE.APP.ORDER_STATUSES)
      .insert({
        app_order: data.app_order,
        status: data.status,
        app_user: appOrder.app_user,
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

  const appOrderDelivery = await transaction
    .from(MODULE.APP.ORDER_DELIVERY)
    .select('*')
    .where('app_order', data.app_order)
    .first();

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
