const MODULE = require('../../../utils/constants/moduleNames');
const knex = require('../../../config/databaseConnection');

async function registerDevice(param, userData) {
  // console.log('param::::::', param);
  // console.log('userData::::::', userData);
  let { tenant } = userData;
  if (param.tenantId) {
    tenant = param.tenantId;
  }
  let result;
  if (param.userId) {
    const userDevice = await knex(MODULE.APP.USER_DEVICE)
      .where('app_user', param.userId)
      .first();

    if (userDevice) {
      result = await knex(MODULE.APP.USER_DEVICE)
        .update({
          token: userData.token,
          device_type: userData.device_type,
          device_id: userData.device_id,
          updated_date: new Date(),
        })
        .where('app_user', userData.app_user)
        .returning('*');
      // console.log('result', result);
    } else {
      const insertData = {
        ...userData,
        tenant,
        app_user: userData.app_user,
      };
      result = await knex(MODULE.APP.USER_DEVICE)
        .insert(insertData)
        .returning('*');
      // console.log('result', result);
    }
  } else {
    result = await knex(MODULE.APP.USER_DEVICE)
      .insert({ ...userData, tenant })
      .returning('*');
    // console.log('result', result);
  }

  const [finalResult] = result;
  return finalResult;
}

module.exports = {
  registerDevice,
};
