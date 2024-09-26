const cron = require('cron');
const { cancelledAppointment } = require('./cron_job/appointment.job');
const { tenantEndTrial } = require('./cron_job/tenant.job');
const { abandonedCart } = require('./cron_job/app-order.job');
const { expiredVoucher } = require('./cron_job/admin-voucher.job');

// Every night at 2 am.
// '0 0 2 * * *'
// cronTime: '0 06 * * * *',
cron.CronJob.from({
  cronTime: '0 0 */1 * * *',
  onTick: () => {
    tenantEndTrial();
    expiredVoucher();
  },
  start: true,
});

// every hour 0 * * * *
cron.CronJob.from({
  cronTime: '*/1 * * * *',
  onTick: () => {
    cancelledAppointment();
  },
  start: true,
});

// Every 14 days at 2 am.
cron.CronJob.from({
  cronTime: '0 0 2 */14 * *',
  onTick: () => {
    abandonedCart();
  },
  start: true,
});
