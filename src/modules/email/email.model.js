const knex = require('../../config/databaseConnection');
const MODULE = require('../../utils/constants/moduleNames');

const findUserById = async (id) => {
  const column = [
    'id',
    'username',
    'is_active',
    'email',
    'tenant',
    'first_name',
    'last_name',
    'avatar',
    'send_to_email',
  ];
  return knex
    .select(column)
    .from(MODULE.BACK_OFFICE_USER)
    .where('id', id)
    .first();
};

const updateUserById = async (id, data) =>
  knex(MODULE.BACK_OFFICE_USER).update(data).where('id', id);

module.exports = {
  findUserById,
  updateUserById,
};
