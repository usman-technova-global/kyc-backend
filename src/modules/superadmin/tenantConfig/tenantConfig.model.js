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
  };
  return knex.select(column).from(MODULE.TENANT_CONFIG);
};

const findById = async (id) => {
  const column = {
    id: 'id',
    name: 'name',
    is_active: 'is_active',
    created_date: 'created_date',
    updated_date: 'updated_date',
    theme_id: 'tenant_config',
  };
  return knex.select(column).from(MODULE.TENANT_CONFIG).where('id', id);
};

const create = async (tenantData) =>
  knex(MODULE.TENANT_CONFIG).insert(tenantData);

module.exports = { create, findById, list };
