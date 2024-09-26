const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const list = async (param) => {
  const orderNumber = knex.raw(
    `'ORD'::text || LPAD(app_order.order_number::text, 15, '0'::text) AS order_number`
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
    'app_order.fulfillment_method',
    'app_order.payment_type',
    'app_order.is_commission',
  ];

  const user = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('email', app_user.email, 'firstName', app_user.first_name, 'lastName', app_user.last_name)) -> 0 AS user`
  );

  const userAddress = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('address', app_user_address.address)) -> 0 AS user_address`
  );

  const columns = [orderNumber, ...appOrderColumns, user, userAddress];

  return knex
    .from(MODULE.APP.ORDER)
    .where('app_order.tenant', param.tenant)
    .leftJoin('app_user', 'app_user.id', 'app_order.app_user')
    .leftJoin(
      'app_user_address',
      'app_user_address.id',
      'app_order.app_user_address'
    )
    .groupBy('app_order.id')
    .orderBy('app_order.created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size)
    .select(columns);
};

const view = async (id) => {
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
    'app_order.is_commission',
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

  // const appOrderDeliveryStatuses = knex.raw(
  //   `
  //   (
  //   SELECT
  //   COALESCE(JSON_AGG(app_order_delivery_statuses.*), '[]')
  //   FROM
  //     app_order_delivery_statuses
  //   WHERE
  //     app_order_delivery_statuses.app_order = app_order.id
  //   ) AS app_order_delivery_statuses
  //   `
  // );

  const appOrderDeliveryStatuses = knex.raw(
    `
    (
    SELECT
    COALESCE(JSON_AGG(inner_query.*), '[]')
    FROM
      (SELECT DISTINCT ON (status) * FROM app_order_delivery_statuses WHERE app_order_delivery_statuses.app_order = app_order.id) as inner_query
    
    ) AS app_order_delivery_statuses
    `
  );

  // const appOrderStatuses = knex.raw(
  //   `
  //   (
  //   SELECT
  //     JSON_AGG( app_order_statuses.*)
  //   FROM
  //     app_order_statuses
  //   WHERE
  //     app_order_statuses.app_order = app_order.id
  //   ) AS app_order_statuses
  //   `
  // );

  const appOrderStatuses = knex.raw(
    `
    (
    SELECT
    COALESCE(JSON_AGG(inner_query.*), '[]')
    FROM
    (SELECT DISTINCT ON (status) * FROM app_order_statuses WHERE app_order_statuses.app_order = app_order.id) as inner_query
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
    .where('app_order.id', id)
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
};

const search = (param, ids) => {
  const orderNumber = knex.raw(
    `'ORD'::text || LPAD(app_order.order_number::text, 15, '0'::text) AS order_number`
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
    'app_order.fulfillment_method',
    'app_order.payment_type',
    'app_order.is_commission',
  ];

  const user = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('email', app_user.email, 'firstName', app_user.first_name, 'lastName', app_user.last_name)) -> 0 AS user`
  );

  const userAddress = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('address', app_user_address.address)) -> 0 AS user_address`
  );

  const columns = [orderNumber, ...appOrderColumns, user, userAddress];

  return knex
    .from(MODULE.APP.ORDER)
    .where('app_order.tenant', param.tenant)
    .whereIn('app_order.app_user', ids)
    .leftJoin('app_user', 'app_user.id', 'app_order.app_user')
    .leftJoin(
      'app_user_address',
      'app_user_address.id',
      'app_order.app_user_address'
    )
    .orWhere((db) => {
      db.whereRaw('app_order.order_number::text ILIKE ?', [
        `%${param.search}%`,
      ]);
    })
    .groupBy('app_order.id')
    .orderBy('app_order.created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size)
    .select(columns);
};

const countWhereIn = async (ids, param) =>
  knex(MODULE.APP.ORDER)
    .count('id')
    .where('tenant', param.tenant)
    .whereIn('app_user', ids);

const count = async (param) =>
  knex.from(MODULE.APP.ORDER).where('tenant', param.tenant).count();

function updateOrderStatus(orderId, data) {
  return knex(MODULE.APP.ORDER).update(data).where({ id: orderId });
}

const getDriverData = async (id) => {
  const columns = [
    'app_user.*',
    knex.raw('json_agg(aude.license_number) -> 0 AS license_number'),
  ];
  return knex
    .from(MODULE.APP.USER)
    .leftJoin('app_user_driver_ext AS aude', 'app_user.id', 'aude.app_user')
    .where('app_user.id', id)
    .where('app_user.user_type', 'Driver')
    .groupBy('app_user.id')
    .first()
    .select(columns);
};

const orderHistory = async (param) => {
  const appOrderQuery = await knex
    .select([
      'app_order.*',
      knex.raw(
        `'ORD' || LPAD(app_order.order_number::text, 15, '0') AS order_number`
      ),
    ])
    .from(MODULE.APP.ORDER)
    .where('id', param.orderId)
    .first();

  const orderStatusQuery = await knex
    .select([
      'aos.*',
      knex.raw(`json_agg(au.*) -> 0 as app_user`),
      knex.raw(`json_agg(aua.*) -> 0 as app_user_address`),
    ])
    .from(`${MODULE.APP.ORDER_STATUSES} as aos`)
    .leftJoin(`${MODULE.APP.USER} as au`, 'au.id', 'aos.app_user')
    .leftJoin(`${MODULE.APP.USER_ADDRESS} as aua`, (db) => {
      db.on('aua.app_user', '=', 'au.id')
        .andOn('aua.is_active', '=', knex.raw('?', [true]))
        .andOn('aua.is_deleted', '=', knex.raw('?', [false]));
    })
    .where('aos.app_order', param.orderId)
    .groupBy('aos.id')
    .orderBy('aos.created_date', 'desc');

  appOrderQuery.app_order_statuses = orderStatusQuery;
  return appOrderQuery;
};

const getItems = async (param) => {
  // const appOrderQuery = await knex
  //   .select([
  //     'ao.*',
  //     knex.raw(`'ORD' || LPAD(ao.order_number::text, 15, '0') AS order_number`),
  //     knex.raw(`json_agg(au.*) -> 0 as app_user`),
  //   ])
  //   .from(`${MODULE.APP.ORDER} as ao`)
  //   .leftJoin(`${MODULE.APP.USER} as au`, 'au.id', 'ao.app_user')
  //   .where('ao.id', param.orderId)
  //   .groupBy('ao.id')
  //   .first();

  const appOrderItem = await knex
    .select('aoi.*', knex.raw(`json_agg(hci.*) -> 0 as home_cat_item`))
    .from(`${MODULE.APP.ORDER_ITEM} as aoi`)
    .leftJoin(`${MODULE.HOME_CATEGORY_ITEM} as hci`, 'hci.id', 'aoi.item_id')
    .where('aoi.app_order', param.orderId)
    .groupBy('aoi.id');

  // appOrderQuery.app_order_item = appOrderItem;

  return appOrderItem;
};

module.exports = {
  list,
  view,
  count,
  search,
  countWhereIn,
  updateOrderStatus,
  getDriverData,
  orderHistory,
  getItems,
};
