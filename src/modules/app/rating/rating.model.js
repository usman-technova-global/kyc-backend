const knex = require('../../../config/databaseConnection');
const { APP_ORDER_STATUS } = require('../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');
const logger = require('../../../utils/commonUtils/logger').adminLogger;

const list = async (session, param) => {
  const appOrder = knex
    .select('id')
    .from(MODULE.APP.ORDER)
    .where({
      app_user: session.userId,
    })
    .andWhere((qb) => {
      qb.orWhere('status', APP_ORDER_STATUS.CUSTOMER_PICK_UP);
      qb.orWhere('status', APP_ORDER_STATUS.DRIVER_DELIVERED_ITEM_TO_CUSTOMER);
      qb.orWhere('status', APP_ORDER_STATUS.COMPLETED);
    });

  const query = knex
    .from(MODULE.APP.ORDER_ITEM)
    .whereIn('app_order', appOrder)
    .andWhere('is_rating', false);

  const queryList = query
    .clone()
    .select(
      'app_order_item.*',
      knex.raw(`json_agg(hci.*) -> 0 AS home_cat_item`)
    )
    .leftJoin('home_cat_item as hci', 'hci.id', 'app_order_item.item_id')
    .groupBy('app_order_item.id')
    .orderBy('app_order_item.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const insert = async (data, param) => {
  const transaction = await knex.transaction();
  const newData = data;
  try {
    const findAppOrderItem = await transaction(MODULE.APP.ORDER_ITEM)
      .where('id', param.appOrderItem)
      .first();

    newData.app_user = param.userId;
    newData.tenant = param.tenantId;
    newData.app_order_item = findAppOrderItem.id;
    newData.home_cat_item = findAppOrderItem.item_id;

    const rating = await transaction(MODULE.APP.RATING)
      .insert(newData)
      .returning('*');

    if (!rating) {
      await transaction.rollback();
      const newError = new Error(`No Create Rating`);
      newError.detail = `Create rating service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const appOrderItemUpdate = await transaction(MODULE.APP.ORDER_ITEM)
      .update({ is_rating: true })
      .where('id', findAppOrderItem.id)
      .returning('*');

    if (!appOrderItemUpdate) {
      await transaction.rollback();
      const newError = new Error(`No App Order Item Update`);
      newError.detail = `App order item service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return rating[0];
  } catch (error) {
    await transaction.rollback();
    logger.error(
      `Error:: ${error}
      Trace:: ${error.stack}`
    );
    throw error;
  }
};

module.exports = {
  list,
  insert,
};
