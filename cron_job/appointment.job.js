const moment = require('moment');
const knex = require('../src/config/databaseConnection');
const { APPOINTMENT_STATUS } = require('../src/utils/constants/enumConstants');

const cancelledAppointment = async () => {
  // console.log('cron job Appointment');
  // await knex.raw(
  //   `
  //         UPDATE store_appointment
  //         SET status = 'Missed'
  //         WHERE (id) IN (
  //             select id from store_appointment where status=:status and appointment_time::date = date(:currentDate) - interval '1 day'
  //         );
  //     `,
  //   {
  //     status: APPOINTMENT_STATUS.NEW,
  //     currentDate: moment().format('YYYY-MM-DD'),
  //   }

  await knex.raw(
    `
            UPDATE store_appointment
            SET status = 'Missed'
            WHERE (id) IN (
                select id from store_appointment where status=:status and appointment_time < :currentDate
            );
        `,
    {
      status: APPOINTMENT_STATUS.NEW,
      currentDate: moment().utc().format('YYYY-MM-DD HH:mm'),
    }
  );
};

module.exports = {
  cancelledAppointment,
};
