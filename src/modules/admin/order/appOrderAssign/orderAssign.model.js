const knex = require('../../../../config/databaseConnection');
const { APP_USER_TYPE } = require('../../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const MODULE = require('../../../../utils/constants/moduleNames');

const IS_DELETED = false;

const list = async (param) => {
  const columns = [
    'app_user.*',
    knex.raw('json_agg(aude.license_number) -> 0 AS license_number'),
    knex.raw(
      "(SELECT json_agg(json_build_object('start_time', adws.start_time, 'end_time', adws.end_time)) AS json_agg FROM app_driver_working_schedule AS adws WHERE app_user.id = adws.app_user and adws.is_active = true) AS app_driver_working_schedule"
    ),
    knex.raw(
      "json_agg(json_build_object('app_user', aod.app_user, 'app_order', aod.app_order, 'status', aod.status)) -> 0 AS app_order_delivery"
    ),
  ];
  return knex
    .select(columns)
    .from(MODULE.APP.USER)
    .leftJoin('app_user_driver_ext AS aude', 'app_user.id', 'aude.app_user')
    .leftJoin('app_order_delivery AS aod', 'app_user.id', 'aod.app_user')
    .where('tenant', param.tenant)
    .andWhere({
      user_type: APP_USER_TYPE.DRIVER,
      'app_user.is_deleted': IS_DELETED,
    })
    .groupBy('app_user.id')
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};
const findByString = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    usertype: APP_USER_TYPE.DRIVER,
    isDeleted: IS_DELETED,
    tenant: param.tenant,
  };
  return knex.raw(
    `SELECT 
    case when count(app_user) = 0 then '[]' else json_agg(id) end as ids
    from app_user
    where user_type = :usertype and (is_deleted = :isDeleted
    and (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search)))`,
    bindParam
  );
};

const search = (param, ids) => {
  const columns = [
    'app_user.*',
    knex.raw('json_agg(aude.license_number) -> 0 AS license_number'),
    knex.raw(
      '(SELECT json_agg(adws.*) AS json_agg FROM app_driver_working_schedule AS adws WHERE app_user.id = adws.app_user and adws.is_active = true) AS app_driver_working_schedule'
    ),
    knex.raw('json_agg(aod.status) -> 0 AS delivery_status'),
  ];
  return knex
    .select(columns)
    .from(MODULE.APP.USER)
    .leftJoin('app_user_driver_ext AS aude', 'app_user.id', 'aude.app_user')
    .leftJoin('app_order_delivery AS aod', 'app_user.id', 'aod.app_user')
    .whereIn('app_user.id', ids)
    .groupBy('app_user.id')
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};

const create = async (data) => {
  const newData = data;
  const appUserShop = newData.app_user_shop;
  delete newData.app_user_shop;
  const transaction = await knex.transaction();
  try {
    let appOrderDeliveryId;
    let appOrderDelivery;
    const getAppOrderDelivery = await transaction(MODULE.APP.ORDER_DELIVERY)
      .select('*')
      .where({ app_order: newData.app_order })
      .first();

    if (getAppOrderDelivery) {
      appOrderDeliveryId = getAppOrderDelivery.id;
      appOrderDelivery = getAppOrderDelivery;
      await transaction(MODULE.APP.ORDER_DELIVERY)
        .update(newData)
        .where('id', getAppOrderDelivery.id);
    } else {
      appOrderDelivery = await transaction(MODULE.APP.ORDER_DELIVERY)
        .insert(newData)
        .returning('*');

      appOrderDeliveryId = appOrderDelivery[0].id;
      if (appOrderDelivery.rowCount <= 0) {
        await transaction.rollback();
        const newError = new Error(`No App Order Delivery`);
        newError.detail = `App order delivery Data Is Not Provided`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    newData.app_order_delivery = appOrderDeliveryId;

    const orderUpdateData = {
      status: newData.status,
      updated_date: new Date(),
    };

    await transaction(MODULE.APP.ORDER)
      .update(orderUpdateData)
      .where('id', newData.app_order);

    const oldOrderDeliveryStatus = await transaction(
      MODULE.APP.ORDER_DELIVERY_STATUSES
    )
      .select('id')
      .where({
        app_order: newData.app_order,
        status: newData.status,
      })
      .first();

    if (!oldOrderDeliveryStatus) {
      const appOrderDeliveryStatuses = await transaction(
        MODULE.APP.ORDER_DELIVERY_STATUSES
      ).insert(newData);

      if (appOrderDeliveryStatuses.rowCount <= 0) {
        await transaction.rollback();
        const newError = new Error(`No App Order Delivery Statuses`);
        newError.detail = `App order delivery Statuses Data Is Not Provided`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      await transaction(MODULE.APP.ORDER_STATUSES).insert({
        app_user: appUserShop,
        app_order: newData.app_order,
        status: newData.status,
      });
    }

    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`No Commit`);
      newError.detail = `No commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    return {
      appOrderDelivery,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const countWhereIn = async (ids, param) =>
  knex(MODULE.APP.ORDER)
    .count('id')
    .where('tenant', param.tenant)
    .whereIn('app_user', ids);

const count = async (param) =>
  knex(MODULE.APP.ORDER).count('id').where('tenant', param.tenant);

module.exports = { list, count, search, countWhereIn, create, findByString };
