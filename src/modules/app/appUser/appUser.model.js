const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const { promiseHandler } = require('../../../utils/commonUtils/promiseHandler');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { APP_USER_TYPE } = require('../../../utils/constants/enumConstants');

const createUser = async (userData) => knex(MODULE.APP.USER).insert(userData);

const getUserPassword = async (id) =>
  knex.from(MODULE.APP.USER).select(['password']).where('id', id).first();

const updateUser = async (userData) =>
  knex(MODULE.APP.USER)
    .update(userData)
    .where('id', userData.id)
    .returning('*');

const resetDriverPassword = async (userData) =>
  knex(MODULE.APP.USER).update({ password: userData.password }).where({
    email: userData.email,
    tenant: userData.tenant,
  });

const signInAppFacebook = async (userData) => {
  const firstName = userData.name.split(' ')[0];
  const lastName = userData.name.split(' ').slice(1).join(' ');

  const bindParameters = {
    userEmail: userData.email,
    userPassword: userData.password,
    userFirstName: firstName,
    userLastName: lastName,
    tenant: userData.tenant,
    userType: APP_USER_TYPE.APP,
  };
  const query = `
  WITH existing_user AS (
    SELECT *
    FROM ${MODULE.APP.USER}
    WHERE email = :userEmail AND tenant = :tenant
  ), inserted_user AS (
  INSERT INTO ${MODULE.APP.USER} (PASSWORD, email, first_name, last_name, tenant, user_type)
    SELECT :userPassword, :userEmail, :userFirstName, :userLastName, :tenant, :userType
    WHERE NOT EXISTS (SELECT 1 FROM existing_user)
    RETURNING *
  )
  SELECT *
  FROM existing_user
  UNION ALL
  SELECT *
  FROM inserted_user
  `;
  const getUserPromise = knex.raw(query, bindParameters);
  const [getUserResult, getUserError] = await promiseHandler(getUserPromise);
  if (!getUserResult) {
    throw getUserError;
  }
  return getUserResult.rows[0];
};

const findUser = async (userData) => {
  const columns = [
    'id',
    'password',
    'email',
    'is_active',
    'created_date',
    'updated_date',
    'tenant',
    'phone',
    'first_name',
    'last_name',
    'postal_code',
    'user_type',
    'loyalty_coins',
  ];

  const user = await knex
    .select(columns)
    .from(MODULE.APP.USER)
    .where({
      email: userData.email,
    })
    .andWhere((queryBuilder) => {
      queryBuilder.orWhere('user_type', userData.userType);
    })
    .modify((queryBuilder) => {
      if (userData.tenant) {
        queryBuilder.where('tenant', userData.tenant);
      }
    })
    .first();

  if (!user) {
    const noUser = new Error(
      `No User Of Type ${userData.userType} Or Shop Exists`
    );
    noUser.detail = `User Does Not Exist`;
    noUser.code = HTTP_STATUS.NOT_FOUND;
    throw noUser;
  }

  return user;
};

const getProfile = async (userData) => {
  const columns = [
    'id',
    'email',
    'is_active',
    'created_date',
    'updated_date',
    'tenant',
    'phone',
    'first_name',
    'last_name',
    'postal_code',
    'user_type',
  ];
  const userProfile = await knex
    .select(columns)
    .from(MODULE.APP.USER)
    .where({
      tenant: userData.tenant,
      id: userData.appUser,
    })
    .first();

  if (!userProfile) {
    const noUser = new Error(`No User With Id ${userData.appUser}`);
    noUser.detail = `User Not Found`;
    noUser.code = HTTP_STATUS.NOT_FOUND;
    throw noUser;
  }

  return userProfile;
};

const findByString = (text) => {
  const columns = [
    knex.raw(
      "case when count(app_user) = 0 then '[]' else json_agg(app_user.id) end as ids"
    ),
  ];
  return knex
    .select(columns)
    .from(MODULE.APP.USER)
    .whereLike('first_name', `%${text}%`)
    .orWhereLike('last_name', `%${text}%`)
    .orWhereLike('email', `%${text}%`);
};

const setStatus = async (userData) => {
  const driver = await knex
    .select('*')
    .from(MODULE.APP.USER)
    .where({
      tenant: userData.tenant,
      id: userData.appUser,
      user_type: APP_USER_TYPE.DRIVER,
    })
    .first();

  if (!driver) {
    const noDriver = new Error(`No Driver With Id ${userData.appUser}`);
    noDriver.detail = `Driver Not Found`;
    noDriver.code = HTTP_STATUS.NOT_FOUND;
    throw noDriver;
  }

  await knex(MODULE.APP.USER).update({ status: userData.status }).where({
    tenant: userData.tenant,
    id: userData.appUser,
    user_type: APP_USER_TYPE.DRIVER,
  });

  return true;
};

const findById = async (id) =>
  knex.select('*').from(MODULE.APP.USER).where('id', id).first();

const loyaltyHistoryList = async (data) => {
  const loyaltyHistoryIds = knex
    .select('app_order')
    .from(MODULE.ADMIN.LOYALTY_HISTORY)
    .where({ app_user: data.appUser, tenant: data.tenant });

  const appOrderItems = knex(MODULE.APP.ORDER_ITEM).whereIn(
    'app_order_item.app_order',
    loyaltyHistoryIds
  );

  const items = appOrderItems
    .clone()
    .select([
      'app_order_item.*',
      knex.raw(`json_agg(hci.*) -> 0 AS home_cat_item`),
    ])
    .leftJoin('home_cat_item as hci', 'hci.id', 'app_order_item.item_id')
    .groupBy('app_order_item.id')
    .orderBy('app_order_item.created_date', 'desc')
    .offset(data.page * data.size)
    .limit(data.size);

  const multiQuery = [appOrderItems.clone().count(), items].join(';');

  const [
    {
      rows: [total],
    },
    { rows: list },
  ] = await knex.raw(multiQuery);

  return {
    list,
    total: total.count,
  };
};

const findByEmail = async (param, email) =>
  knex(MODULE.APP.USER).where({ email, tenant: param.tenant }).first();

module.exports = {
  createUser,
  updateUser,
  findUser,
  findByString,
  getProfile,
  setStatus,
  findById,
  resetDriverPassword,
  // Same Implementation For Now Will Change If User And Driver Has Different Flow
  resetUserPassword: resetDriverPassword,
  signInAppFacebook,
  getUserPassword,
  loyaltyHistoryList,
  findByEmail,
};
