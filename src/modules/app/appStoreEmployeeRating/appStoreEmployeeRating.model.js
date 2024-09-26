const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

async function getEmployeeRatings(data) {
  return (
    knex(`${MODULE.STORE.EMPLOYEE_RATING} as ser`)
      .select([
        'ser.*',
        knex.raw('json_agg(sa.*) -> 0 as appointment'),
        knex.raw('json_agg(item.*) -> 0 as category_item'),
        knex.raw('json_agg(emp.*) -> 0 as employee'),
      ])
      .where('ser.is_deleted', false)
      //   .where('ser.store_employee', data.employee_id)
      .where('ser.app_user', data.user_id)
      .leftJoin(
        `${MODULE.STORE.APPOINTMENT} as sa`,
        'sa.id',
        '=',
        'ser.store_appointment'
      )
      .leftJoin(
        `${MODULE.STORE.SERVICE_CATEGORY_ITEM} as item`,
        'item.id',
        '=',
        'sa.store_service_category_item'
      )
      .leftJoin(
        `${MODULE.STORE.EMPLOYEE} as emp`,
        'emp.id',
        '=',
        'ser.store_employee'
      )
      // eslint-disable-next-line func-names
      .andWhere(function () {
        if (data && data.status) {
          this.where('ser.status', data.status);
        }
      })
      .groupBy('ser.id')
  );
}

async function updateEmployeeRating(data) {
  return knex(`${MODULE.STORE.EMPLOYEE_RATING} as ser`)
    .update({ status: data.status, review: data.review, star: data.star })
    .where('ser.id', data.id)
    .returning('*');
}

module.exports = {
  getEmployeeRatings,
  updateEmployeeRating,
};
