const knex = require('../../../config/databaseConnection');
const { TENANT_TYPE } = require('../../../utils/constants/enumConstants');

const findByTenantId = async (id) => {
  const tenant = await knex
    .select(['t1.*', knex.raw('json_agg(t2.*) -> 0 AS tenant_config')])
    .from('tenant AS t1')
    .leftJoin('tenant_config AS t2', 't2.id', 't1.tenant_config')
    .where('t1.id', id)
    .groupBy(['t1.id'])
    .first();

  tenant.branches = [];
  if (tenant && tenant.tenant_type === TENANT_TYPE.SHOP) {
    tenant.branches = await knex
      .select(['t1.*', knex.raw('json_agg(t2.*) -> 0 AS tenant_config')])
      .from('tenant AS t1')
      .leftJoin('tenant_config AS t2', 't2.id', 't1.tenant_config')
      .where('t1.parent', tenant.id)
      .groupBy(['t1.id']);
  }

  return tenant;
};

module.exports = { findByTenantId };
