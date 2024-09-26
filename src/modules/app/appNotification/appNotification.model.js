const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

async function findByUserIdAndTenantId(data) {
  const notifications = await knex
    .select('*')
    .from(MODULE.APP.NOTIFICATION)
    .where('app_user', data.appUser)
    .andWhere('tenant', data.tenant)
    .offset(data.offset)
    .limit(data.limit);
  const [totalNotifications] = await knex(MODULE.APP.NOTIFICATION)
    .where('app_user', data.appUser)
    .andWhere('tenant', data.tenant)
    .count();

  let page = 0;
  if (totalNotifications.count > 0) {
    page = Math.ceil(data.offset / data.limit) + 1;
  }

  return {
    notifications,
    page,
    perPage: data.limit,
    totalPages: Math.ceil(totalNotifications.count / data.limit),
    totalResults: Number(totalNotifications.count),
  };
}

module.exports = { findByUserIdAndTenantId };
