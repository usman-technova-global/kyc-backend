const knex = require('../../../config/databaseConnection');

const findByTenantId = async (id) =>
  knex
    .select('tenant_config.*')
    .from('tenant')
    .innerJoin('tenant_config', 'tenant.tenant_config', 'tenant_config.id')
    .where('tenant.id', '=', id);

module.exports = { findByTenantId };
