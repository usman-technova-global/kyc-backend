/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const stripe = require('../../../utils/paymentGateway/stripe');
const { rowsToJson } = require('../../../utils/commonUtil');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const adminVoucher = require('../../admin/voucher/voucher.model');
const {
  ORDER_PAYMENT_TYPE,
  APP_CART_STATUS,
  APP_ORDER_STATUS,
  APP_ORDER_PAYMENT_STATUS,
} = require('../../../utils/constants/enumConstants');

async function getHomeCategoryItem(transaction, itemId) {
  return transaction(MODULE.HOME_CATEGORY_ITEM)
    .select('*')
    .where({ id: itemId })
    .first();
}

async function getList(userData) {
  const totalOrdersQuery = knex
    .from(MODULE.APP.ORDER)
    .where({
      app_user: userData.app_user,
      tenant: userData.tenant,
    })
    .andWhere((queryBuilder) => {
      if (userData.search) {
        queryBuilder
          .whereRaw('status::text ILIKE ?', [`%${userData.search}%`])
          .orWhereRaw('payment_type::text ILIKE ?', [`%${userData.search}%`])
          .orWhereRaw('payment_status::text ILIKE ?', [`%${userData.search}%`])
          .orWhereRaw('order_number::text ILIKE ?', [`%${userData.search}%`]);
      }
    })
    .count();

  const appOrderNumber = knex.raw(
    `'ORD'::text || LPAD(app_order.order_number::text, 10, '0'::text) AS app_order_number`
  );

  const appOrderColumns = [
    'app_order.id',
    'app_order.created_date',
    'app_order.updated_date',
    'app_order.app_user',
    'app_order.tenant',
    'app_order.status',
    'app_order.payment_status',
    'app_order.pickup_date_time',
    'app_order.drop_date_time',
    'app_order.app_user_address',
    'app_order.voucher_code',
    'app_order.gst_percentage',
    'app_order.gst_amount',
    'app_order.total_amount',
    'app_order.grand_total',
    'app_order.app_user_cart',
    'app_order.order_number',
    'app_order.checkout_session_id',
    'app_order.payment_type',
  ];

  const items = knex.raw(`COUNT(app_order_item.id) AS items`);

  const ordersQuery = knex
    .from(MODULE.APP.ORDER)
    .leftJoin('app_order_item', 'app_order_item.app_order', 'app_order.id')
    .where({
      app_user: userData.app_user,
      tenant: userData.tenant,
    })
    .andWhere((queryBuilder) => {
      if (userData.search) {
        queryBuilder
          .whereRaw('status::text ILIKE ?', [`%${userData.search}%`])
          .orWhereRaw('payment_type::text ILIKE ?', [`%${userData.search}%`])
          .orWhereRaw('payment_status::text ILIKE ?', [`%${userData.search}%`])
          .orWhereRaw('order_number::text ILIKE ?', [`%${userData.search}%`]);
      }
    })
    .groupBy('app_order.id')
    .orderBy('created_date', 'desc')
    .offset(userData.offset)
    .limit(userData.limit)
    .select([appOrderNumber, ...appOrderColumns, items]);

  const multiQuery = [totalOrdersQuery, ordersQuery].join(';');

  const [
    {
      rows: [totalOrders],
    },
    { rows: orders },
  ] = await knex.raw(multiQuery);

  let page = 0;
  if (totalOrders.count > 0) {
    page = Math.ceil(userData.offset / userData.limit) + 1;
  }

  return {
    orders,
    page,
    perPage: userData.limit,
    totalPages: Math.ceil(totalOrders.count / userData.limit),
    totalResults: Number(totalOrders.count),
  };
}

async function orderDetail(userData) {
  const orderNumber = knex.raw(
    `'ORD'::text || LPAD(app_order.order_number::text, 10, '0'::text) AS order_number`
  );

  const appOrderColumns = [
    'app_order.id',
    'app_order.created_date',
    'app_order.updated_date',
    'app_order.status',
    'app_order.payment_status',
    'app_order.pickup_date_time',
    'app_order.drop_date_time',
    'app_order.gst_percentage',
    'app_order.gst_amount',
    'app_order.total_amount',
    'app_order.grand_total',
    'app_order.payment_type',
    'app_order.fulfillment_method',
  ];

  const orderItems = knex.raw(
    `
    CASE WHEN COUNT(app_order_item.*) = 0 THEN
      '[]'::json
    ELSE
      JSON_AGG(app_order_item.*)
    END AS order_items
    `
  );

  const homeCategoryItems = knex.raw(
    `
    CASE WHEN COUNT(home_cat_item.*) = 0 THEN
      '[]'::json
    ELSE
      JSON_AGG(home_cat_item.*)
    END AS home_cat_items
    `
  );

  const appOrderDeliveryStatuses = knex.raw(
    `
    (
    SELECT
    COALESCE(JSON_AGG(app_order_delivery_statuses.*), '[]')
    FROM
      app_order_delivery_statuses
    WHERE
      app_order_delivery_statuses.app_order = app_order.id
    ) AS app_order_delivery_statuses
    `
  );

  const appOrderStatuses = knex.raw(
    `
    (
    SELECT
      JSON_AGG(app_order_statuses.*)
    FROM
      app_order_statuses
    WHERE
      app_order_statuses.app_order = app_order.id
    ) AS app_order_statuses
    `
  );

  const user = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('email', app_user.email, 'firstName', app_user.first_name, 'lastName', app_user.last_name)) -> 0 AS user`
  );

  const userAddress = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('address', app_user_address.address)) -> 0 AS user_address`
  );

  const columns = [
    orderNumber,
    ...appOrderColumns,
    orderItems,
    homeCategoryItems,
    appOrderDeliveryStatuses,
    appOrderStatuses,
    user,
    userAddress,
  ];

  return knex
    .from('app_order')
    .where('app_order.id', userData.id)
    .leftJoin('app_order_item', 'app_order.id', 'app_order_item.app_order')
    .leftJoin('app_user', 'app_user.id', 'app_order.app_user')
    .leftJoin('home_cat_item', 'home_cat_item.id', 'app_order_item.item_id')
    .leftJoin(
      'app_user_address',
      'app_user_address.id',
      'app_order.app_user_address'
    )
    .groupBy('app_order.id')
    .orderBy('app_order.id', 'desc')
    .select(columns);
}

async function getOrderList(userData) {
  const totalOrdersQuery = knex
    .from(MODULE.APP.ORDER)
    .where({
      app_user: userData.app_user,
      tenant: userData.tenant,
    })
    .count();

  const ordersQuery = knex
    .select('*')
    .from(MODULE.APP.ORDER)
    .where({
      app_user: userData.app_user,
      tenant: userData.tenant,
    })
    .orderBy('created_date', 'desc')
    .offset(userData.offset)
    .limit(userData.limit);

  const multiQuery = [totalOrdersQuery, ordersQuery].join(';');

  const [
    {
      rows: [totalOrders],
    },
    { rows: orders },
  ] = await knex.raw(multiQuery);

  const orderWithItemsPromise = orders.map(async (order) => {
    const orderItems = await knex(MODULE.APP.ORDER_ITEM)
      .where({ app_order: order.id })
      .leftJoin(
        MODULE.HOME_CATEGORY_ITEM,
        `${MODULE.APP.ORDER_ITEM}.item_id`,
        `${MODULE.HOME_CATEGORY_ITEM}.id`
      )
      .select(
        `${MODULE.APP.ORDER_ITEM}.*`,
        knex.raw(`${rowsToJson(MODULE.HOME_CATEGORY_ITEM, ['banner', 'name'])}`)
      );

    const orderItemsWithDetails = orderItems.map((orderItem) => {
      const item = { ...orderItem, ...orderItem.home_cat_item };
      delete item.home_cat_item;
      return item;
    });

    return { ...order, items: orderItemsWithDetails };
  });

  const orderWithItems = await Promise.all(orderWithItemsPromise);

  let page = 0;
  if (totalOrders.count > 0) {
    page = Math.ceil(userData.offset / userData.limit) + 1;
  }

  return {
    orders: orderWithItems,
    page,
    perPage: userData.limit,
    totalPages: Math.ceil(totalOrders.count / userData.limit),
    totalResults: Number(totalOrders.count),
  };
}

async function newOrder(orderObject) {
  const transaction = await knex.transaction();

  try {
    const tenant = await knex(MODULE.TENANT)
      .where('id', orderObject.tenant)
      .first();
    const cart = await transaction(MODULE.APP.USER_CART)
      .select('*')
      .where({
        app_user: orderObject.app_user,
        tenant: orderObject.tenant,
        id: orderObject.cart_id,
        status: APP_CART_STATUS.NEW,
      })
      .first();

    if (!cart) {
      await transaction.rollback();
      const noCartError = new Error(`No Cart With Status 'New'`);
      noCartError.detail = `Cart With 'New' Status Does Not Exist`;
      noCartError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartError;
    }

    if (!cart.pickup_date_time) {
      await transaction.rollback();
      const noCartPickupDateError = new Error(`No Cart Pickup Order Date`);
      noCartPickupDateError.detail = `Cart Pickup Order Date Is Not Set`;
      noCartPickupDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartPickupDateError;
    }
    if (!cart.drop_date_time) {
      await transaction.rollback();
      const noCartDropDateError = new Error(`No Cart Drop Package Date`);
      noCartDropDateError.detail = `Cart Drop Package Date Is Not Set`;
      noCartDropDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartDropDateError;
    }
    if (!cart.app_user_address) {
      await transaction.rollback();
      const noCartUserAddressError = new Error(`No Cart User Address`);
      noCartUserAddressError.detail = `User Address Is Not Provided`;
      noCartUserAddressError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartUserAddressError;
    }

    const cartItems = await transaction(MODULE.APP.USER_CART_ITEM)
      .select('*')
      .where({ cart_id: cart.id });

    if (cartItems.length <= 0) {
      await transaction.rollback();
      const noCartItemsError = new Error(`No Items In Cart`);
      noCartItemsError.detail = `No Products In Cart`;
      noCartItemsError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartItemsError;
    }

    const lineItemsPromise = cartItems.map(async (item) => {
      const homeCategoryItem = await getHomeCategoryItem(
        transaction,
        item.item_id
      );
      const itemPrice = parseInt(
        (Number(homeCategoryItem.price) +
          (Number(homeCategoryItem.price) * cart.gst_percentage) / 100 +
          0.00999) *
          100,
        10
      );
      return {
        price_data: {
          currency: 'USD',
          product_data: {
            name: homeCategoryItem.name,
            description: homeCategoryItem.desc,
            images: [homeCategoryItem.banner],
            metadata: {
              itemId: homeCategoryItem.id,
              categoryId: homeCategoryItem.home_category,
              tenantId: orderObject.tenant,
              userId: orderObject.app_user,
            },
          },
          unit_amount: itemPrice,
        },
        quantity: item.quantity,
      };
    });
    const lineItems = await Promise.all(lineItemsPromise);
    const BASE_URL = `${process.env.WEB_SERVER_PROTOCOL}://${process.env.REDIRECT_HOST}${process.env.WEB_SERVER_BASEPATH}/public`;
    const session = await stripe.checkout.sessions.create({
      success_url: `${BASE_URL}/success.html`,
      cancel_url: `${BASE_URL}/cancel.html`,
      line_items: lineItems,
      mode: 'payment',
    });

    const orderData = {
      id: uuidv4(),
      status: APP_ORDER_STATUS.NEW,
      payment_status: APP_ORDER_PAYMENT_STATUS.UNPAID,
      app_user: cart.app_user,
      tenant: cart.tenant,
      pickup_date_time: cart.pickup_date_time,
      drop_date_time: cart.drop_date_time,
      app_user_address: cart.app_user_address,
      voucher_code: cart.voucher_code,
      gst_percentage: cart.gst_percentage,
      gst_amount: cart.gst_amount,
      total_amount: cart.total_amount,
      grand_total: cart.grand_total,
      app_user_cart: cart.id,
      checkout_session_id: session.id,
    };

    const [order] = await transaction(MODULE.APP.ORDER)
      .insert(orderData)
      .returning('*');

    const orderItemsData = cartItems.map((item) => ({
      id: uuidv4(),
      quantity: item.quantity,
      unit_price: item.unit_price,
      app_order: order.id,
      item_id: item.item_id,
    }));

    const orderItems = await transaction(MODULE.APP.ORDER_ITEM)
      .insert(orderItemsData)
      .returning('*');
    const updatedCart = {
      status: APP_CART_STATUS.PROCESSING,
    };
    await transaction(MODULE.APP.USER_CART)
      .where('id', cart.id)
      .update(updatedCart);

    const orderStatus = {
      app_user: cart.app_user,
      app_order: order.id,
      status: APP_ORDER_STATUS.NEW,
    };

    await transaction(MODULE.APP.ORDER_STATUSES).insert(orderStatus);

    if (cart.voucher_code) {
      let promotionList = await adminVoucher.promotion({
        tenant: order.tenant,
        app_user: order.app_user,
      });
      if (promotionList.length === 0) {
        await transaction.rollback();
        const noCartItemsError = new Error(`No Promotion List Found`);
        noCartItemsError.detail = `No promotion list found`;
        noCartItemsError.code = HTTP_STATUS.BAD_REQUEST;
        throw noCartItemsError;
      }
      promotionList = promotionList.filter(
        (item) => item.voucher_code === cart.voucher_code
      );
      if (promotionList.length > 0) {
        await transaction(MODULE.ADMIN.VOUCHER_HISTORY).insert({
          admin_voucher: promotionList[0].id,
          app_user: order.app_user,
          app_order: order.id,
          tenant: order.tenant,
        });
        if (!promotionList[0].is_unlimited_redeem) {
          if (promotionList[0].redeem_count <= promotionList[0].max_redeem) {
            await transaction(MODULE.ADMIN.VOUCHER)
              .update({
                redeem_count: promotionList[0].redeem_count + 1,
              })
              .where('id', promotionList[0].id);
          }
        }
      }
    }

    const tenantConfig = await transaction(MODULE.TENANT_CONFIG)
      .where('id', tenant.tenant.tenant_config)
      .first();

    if (tenantConfig && tenantConfig.enable_loyalty_program) {
      const orderItemIds = orderItems.map((item) => item.item_id);
      const totalCoins = await transaction(MODULE.HOME_CATEGORY_ITEM)
        .sum('loyalty_coins')
        .whereIn('id', orderItemIds);

      await transaction(MODULE.ADMIN.LOYALTY_HISTORY)
        .insert({
          app_user: order.app_user,
          app_order: order.id,
          tenant: order.tenant,
          coins: Number(totalCoins[0].sum),
        })
        .returning();

      await transaction(MODULE.APP.USER)
        .update({ loyalty_coins: Number(totalCoins[0].sum) })
        .where('id', orderObject.app_user);
    }

    await transaction.commit();
    return {
      order,
      orderItems,
      payment_url: session.url,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function newOrderCash(orderObject) {
  const transaction = await knex.transaction();

  try {
    const cart = await transaction(MODULE.APP.USER_CART)
      .select('*')
      .where({
        app_user: orderObject.app_user,
        tenant: orderObject.tenant,
        id: orderObject.cart_id,
        status: APP_CART_STATUS.NEW,
      })
      .first();

    if (!cart) {
      await transaction.rollback();
      const noCartError = new Error(`No Cart With Status 'New'`);
      noCartError.detail = `Cart With 'New' Status Does Not Exist`;
      noCartError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartError;
    }

    if (!cart.pickup_date_time) {
      await transaction.rollback();
      const noCartPickupDateError = new Error(`No Cart Pickup Order Date`);
      noCartPickupDateError.detail = `Cart Pickup Order Date Is Not Set`;
      noCartPickupDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartPickupDateError;
    }
    if (!cart.drop_date_time) {
      await transaction.rollback();
      const noCartDropDateError = new Error(`No Cart Drop Package Date`);
      noCartDropDateError.detail = `Cart Drop Package Date Is Not Set`;
      noCartDropDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartDropDateError;
    }
    if (!cart.app_user_address) {
      await transaction.rollback();
      const noCartUserAddressError = new Error(`No Cart User Address`);
      noCartUserAddressError.detail = `User Address Is Not Provided`;
      noCartUserAddressError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartUserAddressError;
    }

    const cartItems = await transaction(MODULE.APP.USER_CART_ITEM)
      .where({ cart_id: cart.id })
      .select('*');

    if (cartItems.length <= 0) {
      await transaction.rollback();
      const noCartItemsError = new Error(`No Items In Cart`);
      noCartItemsError.detail = `No Products In Cart`;
      noCartItemsError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartItemsError;
    }

    const orderData = {
      id: uuidv4(),
      payment_type: ORDER_PAYMENT_TYPE.CASH_ON_DELIVERY,
      status: APP_ORDER_STATUS.NEW,
      payment_status: APP_ORDER_PAYMENT_STATUS.UNPAID,
      app_user: cart.app_user,
      tenant: cart.tenant,
      pickup_date_time: cart.pickup_date_time,
      drop_date_time: cart.drop_date_time,
      app_user_address: cart.app_user_address,
      voucher_code: cart.voucher_code,
      gst_percentage: cart.gst_percentage,
      gst_amount: cart.gst_amount,
      total_amount: cart.total_amount,
      grand_total: cart.grand_total,
      app_user_cart: cart.id,
    };

    const [order] = await transaction(MODULE.APP.ORDER)
      .insert(orderData)
      .returning('*');

    const orderItemsData = cartItems.map((item) => ({
      id: uuidv4(),
      quantity: item.quantity,
      unit_price: item.unit_price,
      app_order: order.id,
      item_id: item.item_id,
    }));

    const orderItems = await transaction(MODULE.APP.ORDER_ITEM)
      .insert(orderItemsData)
      .returning('*');

    const updatedCart = {
      status: APP_CART_STATUS.PROCESSING,
    };
    await transaction(MODULE.APP.USER_CART)
      .where('id', cart.id)
      .update(updatedCart);

    const orderStatus = {
      app_user: cart.app_user,
      app_order: order.id,
      status: APP_ORDER_STATUS.NEW,
    };

    await transaction(MODULE.APP.ORDER_STATUSES).insert(orderStatus);

    await transaction.commit();
    return {
      order,
      orderItems,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function newOrderPayFast(orderObject) {
  const transaction = await knex.transaction();

  try {
    const cart = await transaction(MODULE.APP.USER_CART)
      .select('*')
      .where({
        app_user: orderObject.app_user,
        tenant: orderObject.tenant,
        id: orderObject.cart_id,
        status: APP_CART_STATUS.NEW,
      })
      .first();

    if (!cart) {
      await transaction.rollback();
      const noCartError = new Error(`No Cart With Status 'New'`);
      noCartError.detail = `Cart With 'New' Status Does Not Exist`;
      noCartError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartError;
    }

    if (!cart.pickup_date_time) {
      await transaction.rollback();
      const noCartPickupDateError = new Error(`No Cart Pickup Order Date`);
      noCartPickupDateError.detail = `Cart Pickup Order Date Is Not Set`;
      noCartPickupDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartPickupDateError;
    }
    if (!cart.drop_date_time) {
      await transaction.rollback();
      const noCartDropDateError = new Error(`No Cart Drop Package Date`);
      noCartDropDateError.detail = `Cart Drop Package Date Is Not Set`;
      noCartDropDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartDropDateError;
    }
    if (!cart.app_user_address) {
      await transaction.rollback();
      const noCartUserAddressError = new Error(`No Cart User Address`);
      noCartUserAddressError.detail = `User Address Is Not Provided`;
      noCartUserAddressError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartUserAddressError;
    }

    const cartItems = await transaction(MODULE.APP.USER_CART_ITEM)
      .select('*')
      .where({ cart_id: cart.id });

    if (cartItems.length <= 0) {
      await transaction.rollback();
      const noCartItemsError = new Error(`No Items In Cart`);
      noCartItemsError.detail = `No Products In Cart`;
      noCartItemsError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartItemsError;
    }

    const orderData = {
      id: uuidv4(),
      status: APP_ORDER_STATUS.NEW,
      payment_status: APP_ORDER_PAYMENT_STATUS.UNPAID,
      app_user: cart.app_user,
      tenant: cart.tenant,
      pickup_date_time: cart.pickup_date_time,
      drop_date_time: cart.drop_date_time,
      app_user_address: cart.app_user_address,
      voucher_code: cart.voucher_code,
      gst_percentage: cart.gst_percentage,
      gst_amount: cart.gst_amount,
      total_amount: cart.total_amount,
      grand_total: cart.grand_total,
      app_user_cart: cart.id,
    };

    const [order] = await transaction(MODULE.APP.ORDER)
      .insert(orderData)
      .returning('*');

    const orderItemsData = cartItems.map((item) => ({
      id: uuidv4(),
      quantity: item.quantity,
      unit_price: item.unit_price,
      app_order: order.id,
      item_id: item.item_id,
    }));

    const orderItems = await transaction(MODULE.APP.ORDER_ITEM)
      .insert(orderItemsData)
      .returning('*');

    const updatedCart = {
      status: APP_CART_STATUS.PROCESSING,
    };
    await transaction(MODULE.APP.USER_CART)
      .where('id', cart.id)
      .update(updatedCart);

    const orderStatus = {
      app_user: cart.app_user,
      app_order: order.id,
      status: APP_ORDER_STATUS.NEW,
    };

    await transaction(MODULE.APP.ORDER_STATUSES).insert(orderStatus);

    await transaction.commit();
    return {
      order,
      orderItems,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function orderStatusUpdate(sessionId) {
  return knex(MODULE.APP.ORDER)
    .where('checkout_session_id', sessionId)
    .update({ payment_status: APP_ORDER_PAYMENT_STATUS.PAID });
}

async function orderStatusUpdatePayFast(orderId) {
  return knex(MODULE.APP.ORDER)
    .where('id', orderId)
    .update({ payment_status: APP_ORDER_PAYMENT_STATUS.PAID });
}

async function storeStripeLogs(log) {
  const completed = await knex.from(MODULE.APP.STRIPE_LOGS).insert({ log });
  if (completed) {
    return true;
  }
  return false;
}

async function storePayFastLogs(log) {
  const completed = await knex.from(MODULE.APP.PAY_FAST_LOGS).insert({ log });
  if (completed) {
    return true;
  }
  return false;
}

module.exports = {
  newOrder,
  orderStatusUpdate,
  orderStatusUpdatePayFast,
  getOrderList,
  storeStripeLogs,
  storePayFastLogs,
  getList,
  orderDetail,
  newOrderPayFast,
  newOrderCash,
};
