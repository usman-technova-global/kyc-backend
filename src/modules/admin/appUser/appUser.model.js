/* eslint-disable no-param-reassign */
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const { rowsToJson } = require('../../../utils/commonUtil');
const {
  APP_USER_TYPE,
  APP_DRIVER_STATUS,
  ADDRESS_TYPE,
  TRANSACTION_TYPE,
} = require('../../../utils/constants/enumConstants');

const IS_DELETED = false;
const APP_USER_ADDRESS_LAT = 0;
const APP_USER_ADDRESS_LNG = 0;
const SCHEDULE_LIMIT = 7;

const login = async (data) => {
  const user = await knex
    .select([
      'app_user.*',
      knex.raw(
        `JSON_AGG(JSON_BUILD_OBJECT('id', app_user_address.id, 'address', app_user_address.address)) -> 0 AS app_user_address`
      ),
    ])
    .from(MODULE.APP.USER)
    .leftJoin('app_user_address', 'app_user_address.app_user', 'app_user.id')
    .where({
      'app_user.tenant': data.tenant,
      'app_user.email': data.identifier,
      user_type: APP_USER_TYPE.APP,
    })
    .orWhere((db) => {
      db.where('app_user.tenant', data.tenant);
      db.where('app_user.phone', data.identifier);
    })
    .groupBy('app_user.id')
    .first();

  return user;
};

const anonymousLogin = async (identifier) => {
  const user = await knex
    .select([
      'app_user.*',
      knex.raw(
        `json_agg(json_build_object('id', aua.id, 'address', aua.address)) -> 0 AS app_user_address`
      ),
    ])
    .from(MODULE.APP.USER)
    .leftJoin('app_user_address as aua', 'aua.app_user', 'app_user.id')
    .where({ 'app_user.email': identifier, user_type: APP_USER_TYPE.SHOP })
    .orWhere('app_user.phone', identifier)
    .groupBy('app_user.id')
    .first();

  return user;
};

const list = async (param) => {
  let users;
  if (param.userType === APP_USER_TYPE.APP) {
    users = await knex
      .select('*')
      .from(MODULE.APP.USER)
      .where('tenant', param.tenant)
      .andWhere({ is_deleted: IS_DELETED, user_type: APP_USER_TYPE.APP })
      .orderBy('created_date', 'desc')
      .limit(param.size)
      .offset(param.page * param.size);
  } else {
    users = await knex
      .select('*')
      .from(MODULE.APP.USER)
      .where({ tenant: param.tenant, is_deleted: IS_DELETED })
      .andWhereNot('user_type', APP_USER_TYPE.APP)
      .orderBy('created_date', 'desc')
      .limit(param.size)
      .offset(param.page * param.size);
  }

  let newArr = [];
  if (users.length > 0) {
    newArr = users.map(({ password, ...rest }) => rest);
  }
  return newArr;
};

const count = async (param) => {
  let users;
  if (param.userType === APP_USER_TYPE.APP) {
    users = await knex(MODULE.APP.USER)
      .count('id')
      .where('tenant', param.tenant)
      .andWhere({ is_deleted: IS_DELETED, user_type: APP_USER_TYPE.APP });
  } else {
    users = await knex(MODULE.APP.USER)
      .count('id')
      .where({ tenant: param.tenant, is_deleted: IS_DELETED })
      .andWhereNot('user_type', APP_USER_TYPE.APP);
  }
  return users;
};

const search = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
    userType: APP_USER_TYPE.APP,
    tenant: param.tenant,
    limit: param.size,
    offset: param.page * param.size,
  };
  let users;
  if (param.userType === APP_USER_TYPE.APP) {
    users = await knex.raw(
      `
          SELECT *
          FROM app_user
          WHERE tenant = :tenant AND user_type=:userType AND is_deleted = :isDeleted AND (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search) or LOWER(user_type::text) LIKE LOWER(:search))
          ORDER BY created_date DESC
          LIMIT :limit
          OFFSET :offset
        `,
      bindParam
    );
  } else {
    users = await knex.raw(
      `
          SELECT *
          FROM app_user
          WHERE tenant = :tenant AND user_type != :userType AND is_deleted = :isDeleted AND (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search) or LOWER(user_type::text) LIKE LOWER(:search))
          ORDER BY created_date DESC
          LIMIT :limit
          OFFSET :offset
        `,
      bindParam
    );
  }

  let newArr = [];
  if (users.rows.length > 0) {
    newArr = users.rows.map(({ password, ...rest }) => rest);
  }
  return newArr;
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    isDeleted: IS_DELETED,
    userType: APP_USER_TYPE.APP,
    tenant: param.tenant,
  };
  let users;
  if (param.userType === APP_USER_TYPE.APP) {
    users = knex.raw(
      `SELECT COUNT(id) as count FROM app_user WHERE tenant = :tenant AND user_type=:userType AND is_deleted=:isDeleted AND (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search) or LOWER(user_type::text) LIKE LOWER(:search))`,
      bindParam
    );
  } else {
    users = knex.raw(
      `SELECT COUNT(id) as count FROM app_user WHERE tenant = :tenant AND user_type != :userType AND is_deleted=:isDeleted AND (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search) or LOWER(user_type::text) LIKE LOWER(:search))`,
      bindParam
    );
  }

  return users;
};

const findById = (id) =>
  knex.select('*').from(MODULE.APP.USER).where('id', id).first();

const create = async (data) => {
  const transaction = await knex.transaction();
  try {
    const appUserData = {
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      postal_code: data.postal_code,
      user_type: data.user_type,
      status: APP_DRIVER_STATUS.OFFLINE,
      is_active: data.is_active,
      tenant: data.tenant,
      created_by: data.created_by,
      updated_by: data.created_by,
    };

    const appUser = await transaction(MODULE.APP.USER)
      .insert(appUserData)
      .returning('*');

    if (appUser.rowCount <= 0) {
      await transaction.rollback();
      const newError = new Error(`No App User`);
      newError.detail = `App User Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const appUserAddressData = {
      id: uuidv4(),
      name: `${data.first_name} ${data.last_name}`,
      address: data.address,
      app_user: appUser[0].id,
      tenant: appUser[0].tenant,
      latitude: APP_USER_ADDRESS_LAT,
      longitude: APP_USER_ADDRESS_LNG,
      type: ADDRESS_TYPE.HOME,
    };

    const appUserAddress = await transaction(MODULE.APP.USER_ADDRESS)
      .insert(appUserAddressData)
      .returning('*');

    if (appUserAddress.rowCount <= 0) {
      await transaction.rollback();
      const newError = new Error(`No App User Address`);
      newError.detail = `App User Address Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    if (data.user_type === APP_USER_TYPE.DRIVER) {
      const appUserDriverExtData = {
        id: uuidv4(),
        app_user: appUser[0].id,
        license_number: data.license_number,
        created_by: data.created_by,
        updated_by: data.created_by,
      };
      const appUserDriverExt = await transaction(
        MODULE.APP.USER_DRIVER_EXTENSION
      )
        .insert(appUserDriverExtData)
        .returning('*');

      if (appUserDriverExt.rowCount <= 0) {
        await transaction.rollback();
        const newError = new Error(`No App User Driver Ext`);
        newError.detail = `App User Driver Ext Data Is Not Provided`;
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

    return appUser[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const find = async (id) => {
  const user = await knex
    .select('*')
    .from('app_user')
    .where('id', id) // Corrected typo here
    .first();

  if (user && user.user_type === APP_USER_TYPE.DRIVER) {
    const driverExt = await knex(MODULE.APP.USER_DRIVER_EXTENSION).where(
      'app_user',
      user.id
    );
    user.app_user_driver_ext = driverExt;
  } else {
    user.app_user_driver_ext = null;
  }

  return user;
};

const update = async (userId, data) => {
  const transaction = await knex.transaction();
  try {
    const appUserData = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      postal_code: data.postal_code,
      user_type: data.user_type,
      updated_by: data.updated_by,
      updated_date: new Date(),
    };

    const appUser = await transaction(MODULE.APP.USER)
      .update(appUserData)
      .where('id', userId);

    if (!appUser) {
      await transaction.rollback();
      const newError = new Error(`No App User`);
      newError.detail = `App User Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    if (data.user_type === APP_USER_TYPE.DRIVER) {
      // const driver = await knex(appUserDriverExtTable)
      //   .where('app_user', userId)
      //   .first();
      const appUserDriverExtData = {
        license_number: data.license_number,
        updated_by: data.updated_by,
      };
      const appUserDriverExt = await transaction(
        MODULE.APP.USER_DRIVER_EXTENSION
      )
        .update(appUserDriverExtData)
        .where('app_user', userId);

      if (!appUserDriverExt) {
        await transaction.rollback();
        const newError = new Error(`No App User Driver Ext`);
        newError.detail = `App User Driver Ext Data Is Not Provided`;
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

    return appUser;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateStatus = async (id, data) =>
  knex(MODULE.APP.USER).update(data).where('id', id);

const detail = async (id) => {
  const columns = [
    'app_user.*',
    knex.raw(
      "CASE WHEN count(aua.*) = 0 THEN '[]'::json ELSE json_agg(aua.*) END AS app_user_address"
    ),
  ];
  const user = await knex
    .select(columns)
    .from('app_user')
    .leftJoin('app_user_address as aua', 'aua.app_user', 'app_user.id')
    .where({ 'app_user.id': id }) // Corrected typo here
    .groupBy('app_user.id')
    .first();

  let driverExtData = null;
  let driverScheduleData = [];

  if (user && user.user_type === APP_USER_TYPE.DRIVER) {
    const driverExt = await knex(MODULE.APP.USER_DRIVER_EXTENSION)
      .where('app_user', user.id)
      .first();
    const driverSchedule = await knex(MODULE.APP.DRIVER_WORKING_SCHEDULE).where(
      'app_user',
      user.id
    );

    driverExtData = driverExt;
    driverScheduleData = driverSchedule;
  }

  user.app_user_driver_ext = driverExtData;
  user.app_driver_working_schedule = driverScheduleData;

  return user;
};

const addressCreate = async (data) => {
  const newData = data;
  const transaction = await knex.transaction();
  try {
    const findUser = await knex(MODULE.APP.USER)
      .where({
        id: newData.app_user,
        is_active: true,
        is_deleted: false,
      })
      .first();
    if (!findUser) {
      await transaction.rollback();
      const newError = new Error(`No App User Found`);
      newError.detail = `App User is not found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const addressCount = await knex.raw(
      `SELECT COALESCE(COUNT(id), 0) AS count FROM app_user_address WHERE app_user = :appUser`,
      { appUser: newData.app_user }
    );

    if (addressCount.rowCount > 0 && addressCount.rowCount <= 5) {
      await knex(MODULE.APP.USER_ADDRESS)
        .update({ is_active: false })
        .where('app_user', newData.app_user);
    } else {
      await transaction.rollback();
      const newError = new Error(`App User Address Limit End`);
      newError.detail = `App User Address exceed limit`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    newData.name = `${findUser.first_name} ${findUser.last_name}`;
    const appUserAddress = await knex(MODULE.APP.USER_ADDRESS)
      .insert(newData)
      .returning('*');

    if (!appUserAddress[0]) {
      await transaction.rollback();
      const newError = new Error(`App User Address IS Not Created`);
      newError.detail = `App User Address IS Not Created`;
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

    return appUserAddress[0];
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const addressFind = async (id) => {
  const user = await knex
    .select('*')
    .from(MODULE.APP.USER_ADDRESS)
    .where('id', id) // Corrected typo here
    .first();

  return user;
};

const addressUpdate = async (data) => {
  const transaction = await knex.transaction();
  try {
    const findResult = await knex(MODULE.APP.USER_ADDRESS)
      .where({ id: data.id })
      .first();
    if (!findResult) {
      await transaction.rollback();
      const newError = new Error(`App User Address Not Found`);
      newError.detail = `App User Address not found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const checkAddress = await knex(MODULE.APP.USER_ADDRESS)
      .where({
        app_user: findResult.app_user,
        address: data.address,
        type: data.type,
      })
      .andWhereNot('id', data.id);

    if (checkAddress && checkAddress.length > 0) {
      await transaction.rollback();
      const newError = new Error(`App User Address Not Update`);
      newError.detail = `App User Address already exist`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const addressData = {
      latitude: data.latitude,
      longitude: data.longitude,
      type: data.type,
    };
    if (data.address !== findResult.address) addressData.address = data.address;

    const addressUpdated = await knex(MODULE.APP.USER_ADDRESS)
      .update(addressData)
      .where('id', data.id);

    if (!addressUpdated) {
      await transaction.rollback();
      const newError = new Error(`App User Address Not Update`);
      newError.detail = `App User Address is not updated`;
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

    return data;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const addressUpdateStatus = async (id, data) => {
  const newData = data;
  const transaction = await knex.transaction();
  try {
    const findResult = await knex(MODULE.APP.USER_ADDRESS)
      .where('id', id)
      .first();
    if (!findResult) {
      await transaction.rollback();
      const newError = new Error(`App User Address Not Found`);
      newError.detail = `App User Address not found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    await knex(MODULE.APP.USER_ADDRESS)
      .update({ is_active: false })
      .where('app_user', findResult.app_user);

    const updatedStatus = await knex(MODULE.APP.USER_ADDRESS)
      .update({ is_active: true })
      .where('id', id);

    if (!updatedStatus) {
      await transaction.rollback();
      const newError = new Error(`App User Address Not update status`);
      newError.detail = `App User Address not update status`;
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

    newData.id = id;
    return newData;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const scheduleCreate = async (data) => {
  const checkIsScheduled = await knex(MODULE.APP.DRIVER_WORKING_SCHEDULE).where(
    {
      app_user: data.app_user,
    }
  );

  if (checkIsScheduled && checkIsScheduled.length >= SCHEDULE_LIMIT) {
    const newError = new Error(`No Driver Schedule`);
    newError.detail = `Driver schedule exceed the limit`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  const newArr = data.work_days.map((item) => ({
    app_user: data.app_user,
    work_day: item.day,
    start_time: moment(item.start_time).format('YYYY-MM-DD HH:mm:ss'),
    end_time: moment(item.end_time).format('YYYY-MM-DD HH:mm:ss'),
    is_active: true,
    created_by: data.created_by,
    updated_by: data.created_by,
  }));

  return knex(MODULE.APP.DRIVER_WORKING_SCHEDULE).insert(newArr).returning('*');
};

const scheduleFind = async (id) =>
  knex
    .select('*')
    .from(MODULE.APP.DRIVER_WORKING_SCHEDULE)
    .where('id', id)
    .first();

const scheduleUpdate = async (data, id) =>
  knex(MODULE.APP.DRIVER_WORKING_SCHEDULE).update(data).where('id', id);

const voucherHistoryList = async (param) => {
  const user = await knex(MODULE.APP.USER).where('id', param.appUser).first();
  const query = knex.from(MODULE.ADMIN.VOUCHER_HISTORY).where({
    'admin_voucher_history.tenant': user.tenant,
    'admin_voucher_history.app_user': param.appUser,
  });

  const voucherQuery = query
    .clone()
    .select([
      'admin_voucher_history.*',
      knex.raw(`
        (
          SELECT jsonb_agg(
            row_to_json(app_order.*)::jsonb || jsonb_build_object(
              'order_number', 'ORD'::text || lpad(app_order.order_number::text, 15, '0'::text)
            )
          )
          FROM app_order
          WHERE id = admin_voucher_history.app_order
        ) AS app_order
      `),
      knex.raw(`json_agg(av.*) -> 0 AS admin_voucher`),
    ])
    .leftJoin(
      'admin_voucher AS av',
      'av.id',
      'admin_voucher_history.admin_voucher'
    )
    .groupBy('admin_voucher_history.id')
    .orderBy('admin_voucher_history.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), voucherQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const voucherHistorySearch = async (param) => {
  const user = await knex(MODULE.APP.USER).where('id', param.appUser).first();
  const voucherList = knex
    .select('id')
    .from(MODULE.ADMIN.VOUCHER)
    .where('tenant', user.tenant)
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.whereRaw('LOWER(voucher_code) LIKE LOWER(:search)', {
          search: `%${param.search}%`,
        });
      }
    });

  const query = knex
    .from(MODULE.ADMIN.VOUCHER_HISTORY)
    .whereIn('admin_voucher', knex.raw(voucherList))
    .where({
      'admin_voucher_history.tenant': user.tenant,
      'admin_voucher_history.app_user': param.appUser,
    });

  const voucherQuery = query
    .clone()
    .select([
      'admin_voucher_history.*',
      knex.raw(`
        (
          SELECT jsonb_agg(
            row_to_json(app_order.*)::jsonb || jsonb_build_object(
              'order_number', 'ORD'::text || lpad(app_order.order_number::text, 15, '0'::text)
            )
          )
          FROM app_order
          WHERE id = admin_voucher_history.app_order
        ) AS app_order
      `),
      knex.raw(`json_agg(av.*) -> 0 AS admin_voucher`),
    ])
    .leftJoin(
      'admin_voucher AS av',
      'av.id',
      'admin_voucher_history.admin_voucher'
    )
    .groupBy('admin_voucher_history.id')
    .orderBy('admin_voucher_history.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), voucherQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const voucherHistoryDetail = async (param) => {
  const voucherHistory = await knex.raw(
    `
      SELECT avh.*,
        json_agg(av.*) -> 0 AS admin_voucher,
        (
          SELECT jsonb_agg(
            row_to_json(app_order.*)::jsonb || jsonb_build_object(
              'order_number', 'ORD'::text || lpad(app_order.order_number::text, 15, '0'::text)
            )
          )
          FROM app_order
          WHERE id = avh.app_order
        ) AS app_order,
        json_agg(row_to_json(app_user.*)) -> 0 AS app_user
      FROM admin_voucher_history as avh
      LEFT JOIN admin_voucher as av ON av.id = avh.admin_voucher
      LEFT JOIN app_user ON app_user.id = avh.app_user
      WHERE avh.id = :voucherHistoryId
      GROUP BY avh.id
    `,
    { voucherHistoryId: param.voucherHistoryId }
  );

  const orderItems = await knex(MODULE.APP.ORDER_ITEM)
    .where({ app_order: voucherHistory.rows[0].app_order[0].id })
    .leftJoin(
      MODULE.HOME_CATEGORY_ITEM,
      `${MODULE.APP.ORDER_ITEM}.item_id`,
      `${MODULE.HOME_CATEGORY_ITEM}.id`
    )
    .select(
      `${MODULE.APP.ORDER_ITEM}.*`,
      knex.raw(`${rowsToJson(MODULE.HOME_CATEGORY_ITEM)}`)
    );

  const newData = {
    ...voucherHistory.rows[0],
    items: orderItems,
  };
  return newData;
};

const loyaltyHistoryList = async (param) => {
  const user = await knex(MODULE.APP.USER).where('id', param.appUser).first();
  const query = knex.from(MODULE.ADMIN.LOYALTY_HISTORY).where({
    'admin_loyalty_history.tenant': user.tenant,
    'admin_loyalty_history.app_user': param.appUser,
  });

  const voucherQuery = query
    .clone()
    .select([
      'admin_loyalty_history.*',
      knex.raw(`
        (
          SELECT jsonb_agg(
            row_to_json(app_order.*)::jsonb || jsonb_build_object(
              'order_number', 'ORD'::text || lpad(app_order.order_number::text, 15, '0'::text)
            )
          )
          FROM app_order
          WHERE id = admin_loyalty_history.app_order
        ) AS app_order
      `),
      knex.raw(`json_agg(au.*) -> 0 AS app_user`),
    ])
    .leftJoin('app_user AS au', 'au.id', 'admin_loyalty_history.app_user')
    .groupBy('admin_loyalty_history.id')
    .orderBy('admin_loyalty_history.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), voucherQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const loyaltyHistorySearch = async (param) => {
  const user = await knex(MODULE.APP.USER).where('id', param.appUser).first();
  const voucherList = knex
    .select('id')
    .from(MODULE.ADMIN.VOUCHER)
    .where('tenant', user.tenant)
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.whereRaw('LOWER(voucher_code) LIKE LOWER(:search)', {
          search: `%${param.search}%`,
        });
      }
    });

  const query = knex
    .from(MODULE.ADMIN.VOUCHER_HISTORY)
    .whereIn('admin_voucher', knex.raw(voucherList))
    .where({
      'admin_voucher_history.tenant': user.tenant,
      'admin_voucher_history.app_user': param.appUser,
    });

  const voucherQuery = query
    .clone()
    .select([
      'admin_voucher_history.*',
      knex.raw(`json_agg(av.*) -> 0 AS admin_voucher`),
    ])
    .leftJoin(
      'admin_voucher AS av',
      'av.id',
      'admin_voucher_history.admin_voucher'
    )
    .groupBy('admin_voucher_history.id')
    .orderBy('admin_voucher_history.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), voucherQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const loyaltyHistoryDetail = async (param) => {
  const historyDetail = await knex.raw(
    `
      SELECT alh.*,
        (
          SELECT jsonb_agg(
            row_to_json(app_order.*)::jsonb || jsonb_build_object(
              'order_number', 'ORD'::text || lpad(app_order.order_number::text, 15, '0'::text)
            )
          )
          FROM app_order
          WHERE id = alh.app_order
        ) AS app_order,
        json_agg(app_user.*) -> 0 AS app_user
      FROM admin_loyalty_history as alh
      LEFT JOIN app_user ON app_user.id = alh.app_user
      WHERE alh.id = :loyaltyHistoryId
      GROUP BY alh.id
    `,
    { loyaltyHistoryId: param.loyaltyHistoryId }
  );

  const orderItems = await knex(MODULE.APP.ORDER_ITEM)
    .where({ app_order: historyDetail.rows[0].app_order[0].id })
    .leftJoin(
      MODULE.HOME_CATEGORY_ITEM,
      `${MODULE.APP.ORDER_ITEM}.item_id`,
      `${MODULE.HOME_CATEGORY_ITEM}.id`
    )
    .select(
      `${MODULE.APP.ORDER_ITEM}.*`,
      knex.raw(`${rowsToJson(MODULE.HOME_CATEGORY_ITEM)}`)
    );

  const newData = {
    ...historyDetail.rows[0],
    items: orderItems,
  };
  return newData;
};

const driverList = async (param) => {
  const query = knex(MODULE.APP.USER)
    .where({
      'app_user.tenant': param.tenant,
      'app_user.user_type': APP_USER_TYPE.DRIVER,
    })
    .andWhere((qb) => {
      if (qb.search) {
        qb.orWhere('app_user.first_name ILIKE :search', {
          search: `%${param.search}%`,
        });
        qb.orWhere('app_user.last_name ILIKE :search', {
          search: `%${param.search}%`,
        });
        qb.orWhere('app_user.email ILIKE :search', {
          search: `%${param.search}%`,
        });
        qb.orWhere('app_user.phone ILIKE :search', {
          search: `%${param.search}%`,
        });
      }
    });

  const drivers = query
    .clone()
    .select([
      'app_user.*',
      knex.raw(
        `CASE WHEN COUNT(wallets.*) = 0 THEN 'null'::json ELSE json_agg(wallets.*) -> 0 END AS wallets`
      ),
    ])
    .leftJoin(`${MODULE.WALLETS}`, 'wallets.app_user', 'app_user.id')
    .groupBy('app_user.id')
    .orderBy('app_user.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

  const multiQuery = [query.clone().count(), drivers].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    total: total.count,
  };
};

const driverWalletDetail = async (param) => {
  const query = knex(`${MODULE.WALLET_TRANSCATIONS}`)
    .where('wallets', param.wallets)
    // .whereRaw('created_date', [param.to, param.from]);
    .whereRaw(`created_date::date BETWEEN DATE(:to) AND DATE(:from)`, {
      to: param.to,
      from: param.from,
    });

  const totalCreditQUery = query
    .clone()
    .sum('amount')
    .where('type', TRANSACTION_TYPE.CREDIT);
  const totalDebitQuery = query
    .clone()
    .sum('amount')
    .where('type', TRANSACTION_TYPE.DEBIT);

  const walletTransactions = knex.raw(
    `
    SELECT wt.*,
    json_agg(
    json_build_object(
        'order_number', 'ORD'::text || LPAD(app_order.order_number::text, 10, '0'::text), 'created_date', app_order.created_date
      )
    ) -> 0 as app_order
    FROM wallet_transactions as wt
    LEFT JOIN app_order ON app_order.id::text = wt.reference_id
    WHERE wt.wallets = :wallets
    AND wt.created_date::date BETWEEN DATE(:to) AND DATE(:from)
    GROUP BY wt.id
    LIMIT :size 
    OFFSET :offset
    `,
    {
      wallets: param.wallets,
      to: param.to,
      from: param.from,
      size: param.size,
      offset: param.page * param.size,
    }
  );

  const multiQuery = [
    query.count(),
    totalCreditQUery,
    totalDebitQuery,
    walletTransactions,
  ].join(';');

  const [
    {
      rows: [total],
    },
    {
      rows: [totalCredit],
    },
    {
      rows: [totalDebit],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    totalCredit: Number(totalCredit.sum ?? 0),
    totalDebit: Number(totalDebit.sum ?? 0),
    total: parseInt(total.count, 10),
  };
};

const driverDetail = async (param) => {
  const driver = await knex
    .select([
      'app_user.*',
      knex.raw(`json_agg(wallets.*) -> 0 as wallets`),
      knex.raw(
        `(SELECT json_agg(au.*) -> 0 FROM app_user_address as au WHERE au.app_user = app_user.id AND au.is_active = true) as app_user_address`
      ),
      knex.raw(`json_agg(aude.*) -> 0 as app_user_driver_ext`),
    ])
    .from(MODULE.APP.USER)
    .leftJoin(`${MODULE.WALLETS}`, 'wallets.app_user', 'app_user.id')
    .leftJoin(
      `${MODULE.APP.USER_DRIVER_EXTENSION} as aude`,
      'aude.app_user',
      'app_user.id'
    )
    .where('app_user.id', param.appUser)
    .groupBy('app_user.id')
    .first();

  param.wallets = driver.wallets.id;
  driver.wallet_transactions = await driverWalletDetail(param);

  return driver;
};

const lov = async (param) => {
  const columns = [
    'id',
    knex.raw("CONCAT(first_name, ' ', last_name) as name"),
  ];
  const query = knex
    .select(columns)
    .from(MODULE.APP.USER)
    .where('tenant', param.tenant)
    .where('is_deleted', false);

  try {
    const totalList = await query;
    return {
      totalList,
    };
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

module.exports = {
  login,
  list,
  count,
  search,
  countWithSearch,
  detail,
  create,
  find,
  update,
  findById,
  updateStatus,
  addressCreate,
  addressFind,
  addressUpdate,
  addressUpdateStatus,
  scheduleCreate,
  scheduleFind,
  scheduleUpdate,
  anonymousLogin,
  voucherHistoryList,
  voucherHistorySearch,
  voucherHistoryDetail,
  loyaltyHistoryList,
  loyaltyHistorySearch,
  loyaltyHistoryDetail,
  driverList,
  driverDetail,
  driverWalletDetail,
  lov,
};
