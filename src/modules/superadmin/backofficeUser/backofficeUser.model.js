const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');

const findUserByEmail = async (email) => {
  const columns = [
    'id',
    'username',
    'is_active',
    'is_deleted',
    'password',
    'first_name',
    'last_name',
    'is_super_admin',
    'tenant',
    'avatar',
    'user_type',
    'role',
  ];
  return knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where('email', email);
};

const profile = async (id) => {
  const columns = [
    'id',
    'email',
    'is_active',
    'created_date',
    'updated_date',
    'tenant',
    'first_name',
    'last_name',
    'avatar',
    'is_deleted',
    'user_type',
    'address',
    'phone',
    'country',
    'state',
    'city',
    'zip_code',
  ];
  const user = await knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where('id', id)
    .first();

  return user;
};

const profileUpdate = async (data) => {
  const transaction = await knex.transaction();
  try {
    const userId = data.id;
    const user = await knex(MODULE.BACK_OFFICE_USER)
      .where('id', userId)
      .first();
    const backofficeUserData = {
      first_name: data.first_name,
      last_name: data.last_name,
      updated_by: data.id,
      address: data.address,
      country: data.country,
      state: data.state,
      city: data.city,
      zip_code: data.zip_code,
      phone: data.phone,
    };
    if (data.avatar) backofficeUserData.avatar = data.avatar;

    if (user) {
      const backofficeUser = await transaction(MODULE.BACK_OFFICE_USER)
        .update(backofficeUserData)
        .where('id', userId)
        .returning('*');

      if (!backofficeUser) {
        await transaction.rollback();
        const newError = new Error(`No User Data Update`);
        newError.detail = `No user data update`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    } else {
      const backofficeUser = await transaction(MODULE.BACK_OFFICE_USER)
        .insert(backofficeUserData)
        .returning('*');

      if (!backofficeUser) {
        await transaction.rollback();
        const newError = new Error(`No User Data insert`);
        newError.detail = `No user data insert`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return data;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  profile,
  profileUpdate,
};
