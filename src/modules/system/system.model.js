/* eslint-disable camelcase */
const knex = require('../../config/databaseConnection');
const HTTP_STATUS = require('../../utils/constants/httpStatus');
const MODULE = require('../../utils/constants/moduleNames');

const get = async (tenant) => {
  const systemConfig = await knex
    .select([
      'sc.*',
      knex.raw('json_agg(tc.*) -> 0 AS tenant_config'),
      knex.raw('json_agg(theme.*) -> 0 AS theme'),
      knex.raw(
        `CASE 
          WHEN count(banner.id) = 0 THEN '[]'::json 
          ELSE json_agg(banner.* ORDER BY banner.created_date DESC)
        END AS banner`
      ),
    ])
    .from('system_config as sc')
    .leftJoin('tenant', 'tenant.id', 'sc.tenant')
    .leftJoin('tenant_config as tc', 'tc.id', 'tenant.tenant_config')
    .leftJoin('theme', 'theme.id', 'tc.theme')
    .leftJoin('banner', (qb) => {
      qb.on('banner.tenant', '=', 'sc.tenant')
        .andOn(knex.raw('banner.is_active = true'))
        .andOn(knex.raw('banner.is_deleted = false'));
    })
    .where('sc.tenant', tenant)
    .groupBy('sc.id');

  const [listData] = systemConfig;

  return listData;
};

const getSystemConfig = async (domain) => {
  const systemConfig = knex
    .select([
      'sc.*',
      knex.raw('json_agg(tc.*) -> 0 AS tenant_config'),
      knex.raw('json_agg(theme.*) -> 0 AS theme'),
      knex.raw(
        `CASE 
          WHEN count(banner.id) = 0 THEN '[]'::json 
          ELSE json_agg(banner.* ORDER BY banner.created_date DESC)
        END AS banners`
      ),
    ])
    .from('system_config as sc')
    .leftJoin('tenant', 'tenant.id', 'sc.tenant')
    .leftJoin('tenant_config as tc', 'tc.id', 'tenant.tenant_config')
    .leftJoin('banner', (qb) => {
      qb.on('banner.tenant', '=', 'sc.tenant')
        .andOn(knex.raw('banner.is_active = true'))
        .andOn(knex.raw('banner.is_deleted = false'));
    })
    .leftJoin('theme', 'theme.id', 'tc.theme')
    .where('sc.domain', domain)
    .whereNull('sc.parent')
    .groupBy('sc.id')
    .first();

  return systemConfig;
};

const defaultTheme = async () => {
  const theme = knex(MODULE.THEME).where('key', 'Default').first();
  return theme;
};

const systemConfigDetail = async (tenant) => {
  const systemConfig = knex
    .select([
      'sc.*',
      knex.raw(
        `(
        select 
          CASE 
            WHEN count(theme.id) = 0 THEN '[]'::json 
            ELSE json_agg(theme.*)
          END 
        from theme 
        where theme.id IN (
          SELECT jsonb_array_elements_text(sc.theme)::uuid
        )
      ) as themes`
      ),
      knex.raw('json_agg(theme.*) -> 0 AS theme'),
    ])
    .from('system_config as sc')
    .leftJoin('tenant', 'tenant.id', 'sc.tenant')
    .leftJoin('tenant_config as tc', 'tc.id', 'tenant.tenant_config')
    .leftJoin('theme', 'theme.id', 'tc.theme')
    .where('sc.tenant', tenant)
    .groupBy('sc.id')
    .first();

  return systemConfig;
};

const colorChange = async (tenant, data) => {
  const newData = data;
  newData.updated_date = new Date();
  const findTenant = await knex(MODULE.TENANT).where('id', tenant).first();
  const findTheme = await knex(MODULE.THEME).where('id', newData.theme).first();
  if (!findTheme) {
    const newError = new Error(`Theme Not Found`);
    newError.detail = `Theme not found. Pleae contact admin`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const tenantConfig = await knex(MODULE.TENANT_CONFIG)
    .update(newData)
    .where('id', findTenant.tenant_config)
    .returning('*');

  if (!tenantConfig) {
    const newError = new Error(`Theme Not Update`);
    newError.detail = `Theme is not updated`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  return findTheme;
};

const findById = async (tenant) =>
  knex(MODULE.SYSTEM_CONFIG).where('tenant', tenant);

const layoutUpdate = async (tenant, data) =>
  knex(MODULE.SYSTEM_CONFIG).update(data).where('tenant', tenant);

const findByDomain = (domain) =>
  knex
    .select(['id', 'tenant', 'domain'])
    .from(MODULE.SYSTEM_CONFIG)
    .where('domain', domain)
    .whereNull('parent')
    .first();

const tenantWithBranch = async (tenant) =>
  knex(MODULE.TENANT).where('id', tenant).orWhere('parent', tenant);

module.exports = {
  get,
  getSystemConfig,
  systemConfigDetail,
  colorChange,
  layoutUpdate,
  findById,
  defaultTheme,
  findByDomain,
  tenantWithBranch,
};
