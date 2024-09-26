const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  APP_USER_TYPE,
  ADDRESS_TYPE,
} = require('../../../../utils/constants/enumConstants');

const findTenantConfigByTenantId = async (id) => {
  const tenant = await knex.select('*').from('tenant').where('id', id).first();
  const congigResult = await knex
    .select([
      'tc.*',
      knex.raw(`json_agg(tenant.*) -> 0 AS tenant`),
      knex.raw(`json_agg(sc.*) -> 0 AS system_config`),
    ])
    .from('tenant_config as tc')
    .leftJoin('tenant', 'tenant.tenant_config', 'tc.id')
    .leftJoin('system_config as sc', 'sc.tenant', 'tenant.id')
    .where('tc.id', tenant.tenant_config)
    .groupBy('tc.id')
    .first();

  return congigResult;
};

const findByTenant = async (tenant) => {
  const tenantResult = await knex
    .select([
      'tenant.*',
      knex.raw(`json_agg(tc.*) -> 0 AS tenant_config`),
      knex.raw(`json_agg(sc.*) -> 0 AS system_config`),
    ])
    .from('tenant')
    .leftJoin('tenant_config as tc', 'tc.id', 'tenant.tenant_config')
    .leftJoin('system_config as sc', 'sc.tenant', 'tenant.id')
    .where('tenant.id', tenant)
    .groupBy('tenant.id')
    .first();

  return tenantResult;
};

const findById = async (id) => {
  const tenant = await knex.select('*').from('tenant').where('id', id).first();
  return knex
    .select('*')
    .from(MODULE.TENANT_CONFIG)
    .where('id', tenant.tenant_config)
    .first();
};

const findAddressByTenant = (tenant) =>
  knex
    .select('*')
    .from(MODULE.APP.USER_ADDRESS)
    .where({ tenant, is_active: true })
    .first();

const update = async (tenantId, data) => {
  const tenant = await knex
    .select('*')
    .from('tenant')
    .where('id', tenantId)
    .first();

  const newData = {
    desc: data.desc,
    gst_percentage: data.gst_percentage,
    min_order_amount: data.min_order_amount,
    delivery_fee: data.delivery_fee,
    updated_by: data.updated_by,
    logo: data.logo,
    enable_loyalty_program: data.enable_loyalty_program,
    loyalty_coin_conversion_rate: data.loyalty_coin_conversion_rate,
    required_coins_to_redeem: data.required_coins_to_redeem,
    minimum_delivery_time: data.minimum_delivery_time,
    delivery_urgent_fees: data.delivery_urgent_fees,
    shop_address: data.address,
    latitude: data.latitude,
    longitude: data.longitude,
    attendance_distance: data.attendance_distance,
    office_time_in: data.office_time_in,
    office_time_out: data.office_time_out,
  };

  // console.log('newData::::::', newData);

  const tenantConfigUpdate = await knex(MODULE.TENANT_CONFIG)
    .update(newData)
    .where('id', tenant.tenant_config);

  let tenantUpdate = null;
  if (data.user_limit >= 0) {
    const tenantUserLimitCount = await knex('tenant')
      .sum('user_limit')
      .where('parent', tenantId);

    const totalUsersLimits =
      Number(tenantUserLimitCount[0].sum) + Number(data.user_limit);

    if (totalUsersLimits > Number(tenant.max_user_limit)) {
      const newError = new Error(`User limit exceed`);
      newError.detail = `User limit exceed. Pleae contact admin`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    tenantUpdate = knex('tenant')
      .update({ user_limit: data.user_limit })
      .where('id', tenantId);
  }
  if (data.address) {
    // console.log('tenantId', tenantId);
    const appUser = await knex(MODULE.APP.USER)
      .where({
        tenant: tenantId,
        user_type: APP_USER_TYPE.SHOP,
      })
      .first();
    if (appUser) {
      const appUserAddress = await knex(MODULE.APP.USER_ADDRESS)
        .where({
          tenant: tenantId,
          type: ADDRESS_TYPE.OFFICE,
          address: data.address,
        })
        .first();

      if (appUserAddress) {
        if (
          appUserAddress.tenant === tenantId &&
          appUserAddress.address !== data.address
        ) {
          await knex(MODULE.APP.USER_ADDRESS)
            .update({ address: data.address })
            .where('tenant', tenantId)
            .returning('*');
        }
      } else {
        await knex(MODULE.APP.USER_ADDRESS)
          .insert({
            address: data.address,
            app_user: appUser.id,
            tenant: tenantId,
            latitude: 0,
            longitude: 0,
            type: ADDRESS_TYPE.OFFICE,
            is_active: true,
            is_deleted: false,
          })
          .returning('*');
      }
    }
  }
  const finalResult = await Promise.all([tenantConfigUpdate, tenantUpdate]);
  return finalResult[0];
};

const updateMedia = async (tenantConfigId, data) => {
  const newData = {
    facebook: data.facebook,
    instagram: data.instagram,
    linkedin: data.linkedin,
    twitter: data.twitter,
    youtube: data.youtube,
    whatsapp: data.whatsapp,
    updated_by: data.updated_by,
  };

  return knex(MODULE.TENANT_CONFIG).update(newData).where('id', tenantConfigId);
};

module.exports = {
  findTenantConfigByTenantId,
  update,
  findById,
  findAddressByTenant,
  updateMedia,
  findByTenant,
};
