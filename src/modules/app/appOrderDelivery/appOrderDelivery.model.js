/* eslint-disable func-names */
/* eslint-disable camelcase */

const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const { rowsToJson } = require('../../../utils/commonUtil');
const {
  APP_ORDER_STATUS,
  REFERENCE_TYPE,
  WALLET_STATUS,
  TRANSACTION_TYPE,
  ORDER_PAYMENT_TYPE,
} = require('../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

async function assignedOrders(driverData) {
  const userColumns = ['id', 'phone'];
  const orderColumns = ['id', 'order_number'];
  const addressColumns = ['address'];

  const query = knex
    .from(MODULE.APP.ORDER_DELIVERY)
    .where(`${MODULE.APP.ORDER_DELIVERY}.app_user`, driverData.app_user)
    .andWhere((qb) => {
      qb.orWhere(
        `${MODULE.APP.ORDER_DELIVERY}.status`,
        APP_ORDER_STATUS.DRIVER_ASSIGNED_FOR_ITEM_PICKUP
      )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_ACCEPTED_TO_PICK_UP_ITEM_FROM_CUSTOMER
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_PICKED_UP_ITEM_FROM_CUSTOMER
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_DELIVERED_ITEM_TO_SHOP
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_ASSIGNED_FOR_ITEM_DELIVERY
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_ACCEPTED_TO_PICK_UP_ITEM_FROM_SHOP
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_PICKED_UP_ITEM_FROM_SHOP
        );
    })
    .andWhereNot((qb) => {
      qb.orWhere(
        `${MODULE.APP.ORDER_DELIVERY}.status`,
        APP_ORDER_STATUS.DRIVER_DELIVERED_ITEM_TO_CUSTOMER
      )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.CANCELLED
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.COMPLETED
        );
    });

  const filteredQuery = query
    .clone()
    .leftJoin(
      MODULE.APP.ORDER,
      `${MODULE.APP.ORDER_DELIVERY}.app_order`,
      `${MODULE.APP.ORDER}.id`
    )
    .leftJoin(
      MODULE.APP.USER,
      `${MODULE.APP.ORDER}.app_user`,
      `${MODULE.APP.USER}.id`
    )
    .leftJoin(
      MODULE.APP.USER_ADDRESS,
      `${MODULE.APP.ORDER}.app_user_address`,
      `${MODULE.APP.USER_ADDRESS}.id`
    )
    .orderBy(`${MODULE.APP.ORDER_DELIVERY}.created_date`, 'desc')
    .limit(driverData.limit)
    .offset(driverData.offset)
    .select(
      `${MODULE.APP.ORDER_DELIVERY}.*`,
      knex.raw(`${rowsToJson(MODULE.APP.ORDER, orderColumns)}`),
      knex.raw(`${rowsToJson(MODULE.APP.USER, userColumns)}`),
      knex.raw(`${rowsToJson(MODULE.APP.USER_ADDRESS, addressColumns)}`)
    );

  const totalQuery = query.clone().count();

  const multiQuery = [totalQuery, filteredQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: orders },
  ] = await knex.raw(multiQuery);

  const totalOrdersCount = Number(total.count);

  let page = 0;

  if (totalOrdersCount > 0) {
    page = Math.ceil(driverData.offset / driverData.limit) + 1;
  }

  return {
    orders,
    page,
    perPage: driverData.limit,
    totalPages: Math.ceil(totalOrdersCount / driverData.limit),
    totalResults: Number(totalOrdersCount),
  };
}

async function assignedOrderDetails(driverData) {
  // console.log('driverData:::::', driverData);
  const userColumns = ['id', 'phone'];
  const orderColumns = ['id', 'order_number'];
  const addressColumns = ['address'];

  const order = await knex
    .from(MODULE.APP.ORDER_DELIVERY)
    .where(`${MODULE.APP.ORDER_DELIVERY}.app_user`, driverData.app_user)
    .andWhere(`${MODULE.APP.ORDER_DELIVERY}.id`, driverData.order_id)
    .andWhere((qb) => {
      qb.orWhere(
        `${MODULE.APP.ORDER_DELIVERY}.status`,
        APP_ORDER_STATUS.DRIVER_ASSIGNED_FOR_ITEM_PICKUP
      )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_ACCEPTED_TO_PICK_UP_ITEM_FROM_CUSTOMER
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_PICKED_UP_ITEM_FROM_CUSTOMER
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_DELIVERED_ITEM_TO_SHOP
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_ASSIGNED_FOR_ITEM_DELIVERY
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_ACCEPTED_TO_PICK_UP_ITEM_FROM_SHOP
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.DRIVER_PICKED_UP_ITEM_FROM_SHOP
        );
    })
    .andWhereNot((qb) => {
      qb.orWhere(
        `${MODULE.APP.ORDER_DELIVERY}.status`,
        APP_ORDER_STATUS.DRIVER_DELIVERED_ITEM_TO_CUSTOMER
      )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.CANCELLED
        )
        .orWhere(
          `${MODULE.APP.ORDER_DELIVERY}.status`,
          APP_ORDER_STATUS.COMPLETED
        );
    })

    .leftJoin(
      MODULE.APP.ORDER,
      `${MODULE.APP.ORDER_DELIVERY}.app_order`,
      `${MODULE.APP.ORDER}.id`
    )
    .leftJoin(
      MODULE.APP.USER,
      `${MODULE.APP.ORDER}.app_user`,
      `${MODULE.APP.USER}.id`
    )
    .leftJoin(
      MODULE.APP.USER_ADDRESS,
      `${MODULE.APP.ORDER}.app_user_address`,
      `${MODULE.APP.USER_ADDRESS}.id`
    )
    .orderBy(`${MODULE.APP.ORDER_DELIVERY}.created_date`, 'desc')
    .select(
      `${MODULE.APP.ORDER_DELIVERY}.*`,
      knex.raw(`${rowsToJson(MODULE.APP.ORDER, orderColumns)}`),
      knex.raw(`${rowsToJson(MODULE.APP.USER, userColumns)}`),
      knex.raw(`${rowsToJson(MODULE.APP.USER_ADDRESS, addressColumns)}`)
    )
    .first();

  return {
    order,
  };
}

async function setOrderStatus(driverData) {
  const transaction = await knex.transaction();

  const [updatedOrder] = await transaction
    .from(MODULE.APP.ORDER_DELIVERY)
    .where(`${MODULE.APP.ORDER_DELIVERY}.id`, driverData.app_order_delivery)
    .update({
      status: driverData.status,
    })
    .returning('id');

  if (!updatedOrder) {
    await transaction.rollback();
    const orderNotFoundError = new Error(`delivery order does not exist`);
    orderNotFoundError.detail = `delivery order does not exist`;
    orderNotFoundError.code = HTTP_STATUS.BAD_REQUEST;
    throw orderNotFoundError;
  }

  const userColumns = ['id', 'phone'];
  const orderColumns = [
    'id',
    'order_number',
    'grand_total',
    'payment_type',
    'fulfillment_method',
    'payment_status',
  ];
  const addressColumns = ['address'];

  const orderDelivery = await transaction
    .from(MODULE.APP.ORDER_DELIVERY)
    .leftJoin(
      MODULE.APP.ORDER,
      `${MODULE.APP.ORDER_DELIVERY}.app_order`,
      `${MODULE.APP.ORDER}.id`
    )
    .leftJoin(
      MODULE.APP.USER,
      `${MODULE.APP.ORDER}.app_user`,
      `${MODULE.APP.USER}.id`
    )
    .leftJoin(
      MODULE.APP.USER_ADDRESS,
      `${MODULE.APP.ORDER}.app_user_address`,
      `${MODULE.APP.USER_ADDRESS}.id`
    )
    .where(`${MODULE.APP.ORDER_DELIVERY}.id`, updatedOrder.id)
    .andWhere(`${MODULE.APP.ORDER_DELIVERY}.app_user`, driverData.app_user)
    .orderBy(`${MODULE.APP.ORDER_DELIVERY}.created_date`, 'desc')
    .select(
      `${MODULE.APP.ORDER_DELIVERY}.*`,
      knex.raw(`${rowsToJson(MODULE.APP.ORDER, orderColumns)}`),
      knex.raw(`${rowsToJson(MODULE.APP.USER, userColumns)}`),
      knex.raw(`${rowsToJson(MODULE.APP.USER_ADDRESS, addressColumns)}`)
    )
    .first();

  await transaction
    .from(MODULE.APP.ORDER)
    .update({ status: orderDelivery.status })
    .where('id', orderDelivery.app_order.id);

  // if (
  //   driverData.status !==
  //     APP_ORDER_STATUS.DRIVER_DECLINED_TO_PICKUP_ITEM_FROM_CUSTOMER ||
  //   driverData.status !== APP_ORDER_STATUS.DRIVER_RETURNED_ITEM_TO_CUSTOMER ||
  //   driverData.status !==
  //     APP_ORDER_STATUS.DRIVER_DECLINED_TO_PICKUP_ITEM_FROM_SHOP ||
  //   driverData.status !== APP_ORDER_STATUS.DRIVER_RETURNED_ITEM_TO_SHOP
  // ) {

  const newOrderDeliveryStatusData = {
    app_user: driverData.app_user,
    app_order: orderDelivery.app_order.id,
    app_order_delivery: orderDelivery.id,
    created_by: driverData.app_user,
    status: orderDelivery.status,
  };

  await transaction
    .from(MODULE.APP.ORDER_DELIVERY_STATUSES)
    .insert(newOrderDeliveryStatusData);

  const newOrderStatusData = {
    app_user: driverData.app_user,
    app_order: orderDelivery.app_order.id,
    status: orderDelivery.status,
  };

  const newOrderStatus = await transaction(MODULE.APP.ORDER_STATUSES)
    .select('id')
    .where({
      app_order: orderDelivery.app_order.id,
      status: orderDelivery.status,
    })
    .first();

  if (
    driverData.status === APP_ORDER_STATUS.DRIVER_DELIVERED_ITEM_TO_CUSTOMER &&
    orderDelivery.app_order.payment_type === ORDER_PAYMENT_TYPE.CASH_ON_DELIVERY
  ) {
    const wallet = await transaction(MODULE.WALLETS)
      .where('app_user', driverData.app_user)
      .first();
    // console.log('orderDelivery.app_order::::::::', orderDelivery.app_order);
    let balance = Number(orderDelivery.app_order.grand_total);
    // console.log('balance::::::', balance);
    let walletQuery = [];
    if (wallet) {
      balance += Number(wallet.balance);
      // console.log('balance::::', balance);
      walletQuery = await transaction(MODULE.WALLETS)
        .update({
          balance,
          updated_date: new Date(),
        })
        .where('id', wallet.id)
        .returning('*');
    } else {
      walletQuery = await transaction(MODULE.WALLETS)
        .insert({
          tenant: driverData.tenant,
          app_user: driverData.app_user,
          balance,
          reference_type: REFERENCE_TYPE.DRIVER,
          status: WALLET_STATUS.BALANCE,
        })
        .returning('*');
    }
    // await transaction.rollback();
    const [wallets] = walletQuery;
    if (!wallets) {
      await transaction.rollback();
      const orderNotFoundError = new Error(`No driver wallet create`);
      orderNotFoundError.detail = `No driver wallet create`;
      orderNotFoundError.code = HTTP_STATUS.BAD_REQUEST;
      throw orderNotFoundError;
    }

    const [walletTransactions] = await transaction(MODULE.WALLET_TRANSCATIONS)
      .insert({
        wallets: wallets.id,
        type: TRANSACTION_TYPE.CREDIT,
        amount: Number(orderDelivery.app_order.grand_total),
        reference_id: orderDelivery.app_order.id,
      })
      .returning('*');

    if (!walletTransactions) {
      await transaction.rollback();
      const orderNotFoundError = new Error(
        `No driver wallet transaction create`
      );
      orderNotFoundError.detail = `No driver wallet transaction create`;
      orderNotFoundError.code = HTTP_STATUS.BAD_REQUEST;
      throw orderNotFoundError;
    }
  }

  // console.log('newOrderStatus::::::::', newOrderStatus);

  if (!newOrderStatus) {
    await transaction
      .from(MODULE.APP.ORDER_STATUSES)
      .insert(newOrderStatusData);
  }
  // }
  // await transaction.commit();
  const commit = await transaction.commit();
  if (commit.response.rowCount !== null) {
    await transaction.rollback();
    const newError = new Error(`Commit`);
    newError.detail = `Commit service is not execute`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  return { order: orderDelivery };
}

module.exports = {
  assignedOrders,
  setOrderStatus,
  assignedOrderDetails,
};
