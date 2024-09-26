const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

const list = () => {
  const column = {
    id: 'id',
    name: 'name',
    is_active: 'is_active',
    created_date: 'created_date',
    updated_date: 'updated_date',
    theme_id: 'tenant_config',
    desc: 'desc',
    parent: 'parent',
    trial_mode: 'trial_mode',
    trial_start_date: 'trial_start_date',
  };
  return knex.select(column).from(MODULE.TENANT);
};
const findById = async (id) => {
  const column = {
    id: 'id',
    name: 'name',
    is_active: 'is_active',
    created_date: 'created_date',
    updated_date: 'updated_date',
    theme_id: 'tenant_config',
    desc: 'desc',
    parent: 'parent',
    trial_mode: 'trial_mode',
    trial_start_date: 'trial_start_date',
  };
  return knex.select(column).from(MODULE.TENANT).where('id', id);
};

const create = async (tenantData) => knex(MODULE.TENANT).insert(tenantData);

const findByTenant = async (tenat) => {
  const column = {
    id: 'tenant.id',
    name: 'name',
    tenant_config: 'tenant_config',
    max_employee_limit: 'max_user_limit',
    employee_limit: 'user_limit',
    branch_limit: 'max_branch_limit',
    trial_mode: 'trial_mode',
    trial_start_date: 'trial_start_date',
    trial_mode_limit: 'trial_mode_limit',
  };
  return knex.select(column).from(MODULE.TENANT).where('id', tenat).first();
};
const findTenantByIdWithConfig = async (tenat) => {
  const newColumn = [
    'tenant.id',
    'tenant.name',
    'tenant_config',
    'user_limit',
    'max_user_limit',
    'max_branch_limit',
    'trial_mode',
    'trial_start_date',
    'trial_mode_limit',
    knex.raw(`json_agg(tc.*) -> 0 AS tenant_config`),
  ];

  return knex
    .select(newColumn)
    .from(MODULE.TENANT)
    .leftJoin('tenant_config as tc', 'tc.id', 'tenant.tenant_config')
    .where('tenant.id', tenat)
    .groupBy('tenant.id')
    .first();
};

const getTenantQuery = (tenant) =>
  knex
    .select(['id', 'parent'])
    .from(MODULE.TENANT)
    .where('id', tenant)
    .orWhere('parent', tenant);

module.exports = {
  create,
  findById,
  list,
  findByTenant,
  findTenantByIdWithConfig,
  getTenantQuery,
};
