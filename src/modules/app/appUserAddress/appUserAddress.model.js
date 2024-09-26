const knex = require('../../../config/databaseConnection');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');

const IS_DELETED = false;
const IS_ACTIVE = false;

async function appUserAddress(data) {
  const transaction = await knex.transaction();
  try {
    const appUserAddressUniq = await transaction(MODULE.APP.USER_ADDRESS)
      .select('*')
      .where({ name: data.name, app_user: data.app_user, is_deleted: false })
      .first();

    if (appUserAddressUniq === undefined) {
      const appUserAddressTemp = await transaction(MODULE.APP.USER_ADDRESS)
        .select('*')
        .where('app_user', data.app_user);

      if (appUserAddressTemp.length > 0) {
        const appUserAddressData = {
          is_active: IS_ACTIVE,
        };
        const appUserAddressUpdate = await transaction(MODULE.APP.USER_ADDRESS)
          .where('app_user', data.app_user)
          .update(appUserAddressData);

        if (!appUserAddressUpdate) {
          await transaction.rollback();
          const newError = new Error(`No App User Address`);
          newError.detail = `App User Address Data Is Not Provided`;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
      }

      const appUserAddressCreate = await transaction(
        MODULE.APP.USER_ADDRESS
      ).insert(data);

      if (appUserAddressCreate.rowCount <= 0) {
        await transaction.rollback();
        const newError = new Error(`No App User address`);
        newError.detail = `App User Address Data Is Not Provided`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      const commit = await transaction.commit();
      if (commit.response.rowCount !== null) {
        await transaction.rollback();
        const newError = new Error(`Commit`);
        newError.detail = `Commit service is not execute`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      return appUserAddressCreate;
    }
    await transaction.rollback();
    const newError = new Error(`Found app user`);
    newError.detail = `User and name must be unique`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }

  // return knex(tableName).insert(userData);
}

function listUserAddress(userId, tenantId) {
  const column = [
    'id',
    'name',
    'address',
    'created_date',
    'updated_date',
    'app_user',
    'tenant',
    'latitude',
    'longitude',
    'type',
    'is_active',
    'is_deleted',
  ];
  return knex(MODULE.APP.USER_ADDRESS)
    .select(column)
    .where({ app_user: userId, tenant: tenantId, is_deleted: IS_DELETED });
}

const updateStatus = async (getData) => {
  const transaction = await knex.transaction();
  try {
    const appUserAddressDeactivateData = {
      is_active: IS_ACTIVE,
    };
    const appUserAddressDeactivate = await transaction(MODULE.APP.USER_ADDRESS)
      .update(appUserAddressDeactivateData)
      .where('app_user', getData.app_user);

    if (!appUserAddressDeactivate) {
      await transaction.rollback();
      const newError = new Error(`No App User Address`);
      newError.detail = `App User Address Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const data = {
      is_active: true,
    };
    const appUserAddressUpdate = await transaction(MODULE.APP.USER_ADDRESS)
      .where('id', getData.id)
      .update(data);

    if (!appUserAddressUpdate) {
      await transaction.rollback();
      const newError = new Error(`No App User address`);
      newError.detail = `App User Address Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    return appUserAddressUpdate;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteUserAddress = async (data) => {
  const deleteCount = await knex
    .from(MODULE.APP.USER_ADDRESS)
    .where('id', data.id)
    .update({ is_deleted: true });
  return deleteCount;
};

const findById = (id) =>
  knex.select('*').from(MODULE.APP.USER_ADDRESS).where('id', id).first();

module.exports = {
  appUserAddress,
  listUserAddress,
  updateStatus,
  deleteUserAddress,
  findById,
};
