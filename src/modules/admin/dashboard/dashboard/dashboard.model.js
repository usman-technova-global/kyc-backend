const moment = require('moment');
const knex = require('../../../../config/databaseConnection');
const {
  APPOINTMENT_STATUS,
} = require('../../../../utils/constants/enumConstants');
const MODULE = require('../../../../utils/constants/moduleNames');

const detail = async (id, todayDate) => {
  let year = '';
  let date = todayDate;
  if (moment(date).isValid()) {
    year = moment(date).year();
    date = moment.utc(date).format('YYYY-MM-DD');
  } else {
    year = moment().year();
    date = moment.utc().format('YYYY-MM-DD');
  }

  // console.log('date', date, year);

  const todayAppointment = await knex(MODULE.STORE.APPOINTMENT)
    .where('tenant', id)
    .whereRaw('DATE(appointment_time)=?', date)
    .count('id');
  const totalAppointment = await knex(MODULE.STORE.APPOINTMENT)
    .count('id')
    .where('tenant', id)
    // .where('status', APPOINTMENT_STATUS.COMPLETED)
    .whereRaw('EXTRACT(YEAR FROM appointment_time)=?', year);

  const completedMonthlyAppointments = await knex(MODULE.STORE.APPOINTMENT)
    .select(
      knex.raw('EXTRACT(MONTH FROM appointment_time) AS month'),
      knex.raw('COUNT(id) AS count')
    )
    .where('tenant', id)
    .whereRaw('EXTRACT(YEAR FROM appointment_time)=?', year)
    .where('status', APPOINTMENT_STATUS.COMPLETED)
    .groupByRaw('EXTRACT(MONTH FROM appointment_time)')
    .orderByRaw('EXTRACT(MONTH FROM appointment_time)');

  const inCompletedMonthlyAppointments = await knex(MODULE.STORE.APPOINTMENT)
    .select(
      knex.raw('EXTRACT(MONTH FROM appointment_time) AS month'),
      knex.raw('COUNT(id) AS count')
    )
    .where('tenant', id)
    .whereRaw('EXTRACT(YEAR FROM appointment_time)=?', year)
    .whereNot('status', APPOINTMENT_STATUS.COMPLETED)
    .groupByRaw('EXTRACT(MONTH FROM appointment_time)')
    .orderByRaw('EXTRACT(MONTH FROM appointment_time)');

  // Sales

  const completedMonthlySales = await knex(MODULE.STORE.APPOINTMENT)
    .select(
      knex.raw('EXTRACT(MONTH FROM appointment_time) AS month'),
      knex.raw('SUM(grand_total_amount) AS total_sales')
    )
    .where('tenant', id)
    .whereRaw('EXTRACT(YEAR FROM appointment_time) = ?', year)
    .where('status', APPOINTMENT_STATUS.COMPLETED)
    .groupByRaw('EXTRACT(MONTH FROM appointment_time)')
    .orderByRaw('EXTRACT(MONTH FROM appointment_time)');

  const missedMonthlySales = await knex(MODULE.STORE.APPOINTMENT)
    .select(
      knex.raw('EXTRACT(MONTH FROM appointment_time) AS month'),
      knex.raw('SUM(grand_total_amount) AS total_sales')
    )
    .where('tenant', id)
    .whereRaw('EXTRACT(YEAR FROM appointment_time) = ?', year)
    .where('status', APPOINTMENT_STATUS.MISSED)
    .groupByRaw('EXTRACT(MONTH FROM appointment_time)')
    .orderByRaw('EXTRACT(MONTH FROM appointment_time)');

  const canceledMonthlySales = await knex(MODULE.STORE.APPOINTMENT)
    .select(
      knex.raw('EXTRACT(MONTH FROM appointment_time) AS month'),
      knex.raw('SUM(grand_total_amount) AS total_sales')
    )
    .where('tenant', id)
    .whereRaw('EXTRACT(YEAR FROM appointment_time) = ?', year)
    .where('status', APPOINTMENT_STATUS.CANCELLED)
    .groupByRaw('EXTRACT(MONTH FROM appointment_time)')
    .orderByRaw('EXTRACT(MONTH FROM appointment_time)');

  const top5Customers = await knex('store_appointment as sa')
    .select(
      'sa.name',
      'sa.email',
      knex.raw('count(sa.id) as count'),
      'sa.status',
      'ssci.name as service'
    )
    .where('tenant', id)
    .max('sa.appointment_time as date_in')
    .join(
      'store_service_category_item as ssci',
      'ssci.id',
      'sa.store_service_category_item'
    )
    .groupBy('sa.email', 'sa.name', 'sa.status', 'ssci.name')
    .orderBy('date_in', 'desc')
    .limit(5);

  const top4SellingServices = await knex('store_service_category_item as ssci')
    .select(
      'ssci.name as service',
      knex.raw('COALESCE(sum(sa.grand_total_amount), 0) as total_amount')
    )
    .where('tenant', id)
    // eslint-disable-next-line func-names
    .leftJoin('store_appointment as sa', function () {
      this.on('ssci.id', '=', 'sa.store_service_category_item')
        .andOn(knex.raw('EXTRACT(YEAR FROM sa.appointment_time) = ?', [year]))
        .andOn(knex.raw('sa.status = ?', [APPOINTMENT_STATUS.COMPLETED]));
    })
    .groupBy('ssci.name')
    .orderBy('total_amount', 'desc')
    .limit(4);

  return {
    today_appointments: todayAppointment[0].count,
    total_appointments: totalAppointment[0].count,
    completed_appointments_stats: completedMonthlyAppointments,
    inCompleted_appointments_stats: inCompletedMonthlyAppointments,
    sales: {
      completed: completedMonthlySales,
      missed: missedMonthlySales,
      canceled: canceledMonthlySales,
    },
    customers: top5Customers,
    topServices: top4SellingServices,
  };
};

module.exports = { detail };
