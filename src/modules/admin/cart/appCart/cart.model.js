const knex = require('../../../../config/databaseConnection');
const {
  APP_CART_STATUS,
} = require('../../../../utils/constants/enumConstants');
const MODULE = require('../../../../utils/constants/moduleNames');

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.VIEW.CART_LIST)
    .where('tenant', param.tenant)
    .andWhere('status', '!=', APP_CART_STATUS.ABANDONED)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const search = (param, ids) =>
  knex
    .select('*')
    .from(MODULE.VIEW.CART_LIST)
    .where('tenant', param.tenant)
    .andWhere('status', '!=', APP_CART_STATUS.ABANDONED)
    .whereIn('app_user', ids)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const view = async (id) => {
  const appUserCartColumns = [
    'app_user_cart.id',
    'app_user_cart.created_date',
    'app_user_cart.updated_date',
    'app_user_cart.app_user_address',
    'app_user_cart.pickup_date_time',
    'app_user_cart.drop_date_time',
    'app_user_cart.gst_percentage',
    'app_user_cart.gst_amount',
    'app_user_cart.total_amount',
    'app_user_cart.grand_total',
    'app_user_cart.status',
  ];

  const appUserCartItems = knex.raw(
    `
    CASE WHEN count(app_user_cart_item.*) = 0 THEN
      '[]'::json
    ELSE
      json_agg(app_user_cart_item.*)
    END AS app_user_cart_items
    `
  );

  const homeCatItems = knex.raw(
    `
    CASE WHEN COUNT(home_cat_item.*) = 0 THEN
      '[]'::json
    ELSE
      JSON_AGG(home_cat_item.*)
    END AS home_cat_items
    `
  );

  const user = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('email', app_user.email, 'firstName', app_user.first_name, 'lastName', app_user.last_name)) -> 0 AS "user"`
  );

  const userAddress = knex.raw(
    `JSON_AGG(JSON_BUILD_OBJECT('address', app_user_address.address)) -> 0 AS user_address`
  );

  return knex
    .from(MODULE.APP.USER_CART)
    .leftJoin(
      'app_user_cart_item',
      'app_user_cart.id',
      'app_user_cart_item.cart_id'
    )
    .leftJoin('home_cat_item', 'app_user_cart_item.item_id', 'home_cat_item.id')
    .leftJoin('app_user', 'app_user_cart.app_user', 'app_user.id')
    .leftJoin(
      'app_user_address',
      'app_user_cart.app_user_address',
      'app_user_address.id'
    )
    .groupBy('app_user_cart.id')
    .orderBy('app_user_cart.id', 'DESC')
    .where('app_user_cart.id', id)
    .andWhere('app_user_cart.status', '!=', APP_CART_STATUS.ABANDONED)
    .select([
      ...appUserCartColumns,
      appUserCartItems,
      homeCatItems,
      user,
      userAddress,
    ]);
};

const countWhereIn = async (ids, param) =>
  knex(MODULE.APP.USER_CART)
    .count('id')
    .where('tenant', param.tenant)
    .andWhere('status', '!=', APP_CART_STATUS.ABANDONED)
    .whereIn('app_user', ids);

const count = async (param) =>
  knex(MODULE.APP.USER_CART)
    .count('id')
    .where('tenant', param.tenant)
    .andWhere('status', '!=', APP_CART_STATUS.ABANDONED);

module.exports = { list, view, count, search, countWhereIn };
