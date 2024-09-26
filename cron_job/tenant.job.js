const moment = require('moment');
const knex = require('../src/config/databaseConnection');

const tenantEndTrial = async () => {
  const tenantIds = [];
  const tenantResult = await knex('tenant').where({
    trial_mode: true,
    is_active: true,
  });

  if (tenantResult && tenantResult.length) {
    tenantResult.map((item) => {
      const currentDate = moment().format('YYYY-MM-DD');
      const tenantExpiryDate = moment(
        moment(item.trial_start_date).add(item.trial_mode_limit, 'days')
      ).format('YYYY-MM-DD');
      if (currentDate > tenantExpiryDate) {
        tenantIds.push(item.id);
      }
      return item;
    });
  }

  if (tenantIds && tenantIds.length > 0) {
    const backofficeIds = [];
    let appUserPromise = null;
    const backofficeUserResult = await knex
      .select('id')
      .from('backoffice_user')
      .whereIn('tenant', tenantIds);

    backofficeUserResult.forEach((item) => backofficeIds.push(item.id));
    const updateTenantPromise = knex('tenant')
      .update({ is_active: false, trial_mode: false })
      .whereIn('id', tenantIds);
    const updatebackofficePromise = knex('backoffice_user')
      .update({ is_active: false, is_deleted: true })
      .whereIn('id', backofficeIds);

    const appUsers = await knex('app_user').whereIn('tenant', tenantIds);
    if (appUsers && appUsers.length > 0) {
      appUserPromise = knex('app_user')
        .update({ is_active: false, is_deleted: true })
        .whereIn('tenant', tenantIds);
    }

    await Promise.all([
      updateTenantPromise,
      updatebackofficePromise,
      appUserPromise,
    ]);
  }
};

module.exports = {
  tenantEndTrial,
};
