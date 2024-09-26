const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

const { findByTenant } = require('../../superadmin/tenant/tenant.model');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const {
  BACK_OFFICE_USER_TYPE,
} = require('../../../utils/constants/enumConstants');

const listUsers = async () => {
  const columns = ['id', 'username', 'is_active', 'is_deleted'];
  return knex.select(columns).from(MODULE.BACK_OFFICE_USER);
};

const findUserById = async (id) => {
  const columns = [
    'id',
    'username',
    'tenant',
    'role',
    'is_active',
    'is_deleted',
  ];
  const users = await knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where('id', id);
  return users;
};

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

const loginService = async (email) => {
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

const findUserByCode = async (code) => {
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
    'role',
    'code',
  ];
  return knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where('code', code)
    .first();
};

const createUser = async (userData) =>
  knex(MODULE.BACK_OFFICE_USER).insert(userData);

const update = (id, data) =>
  knex(MODULE.BACK_OFFICE_USER).update(data).where('id', id);

const list = async (param) =>
  knex
    .select('*')
    .from(MODULE.BACK_OFFICE_USER)
    .where({
      parent: param.userId,
      user_type: BACK_OFFICE_USER_TYPE.USER,
      is_deleted: false,
    })
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

const count = async (param) =>
  knex(MODULE.BACK_OFFICE_USER).count('id').where({
    parent: param.userId,
    user_type: BACK_OFFICE_USER_TYPE.USER,
    is_deleted: false,
  });

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    parent: param.userId,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM backoffice_user WHERE parent=:parent and user_type = 'User' and is_deleted = false and (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search)) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    parent: param.userId,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM backoffice_user WHERE parent=:parent and user_type = 'User' and is_deleted = false and (LOWER(first_name) LIKE LOWER(:search) or LOWER(last_name) LIKE LOWER(:search) or LOWER(email) LIKE LOWER(:search))`,
    bindParam
  );
};

const findByUserTenantId = (tenant) =>
  knex
    .select('*')
    .from(MODULE.BACK_OFFICE_USER)
    .where('tenant', tenant)
    .first();

const edit = (id) =>
  knex.select('*').from(MODULE.BACK_OFFICE_USER).where('id', id).first();

const insert = async (body) => {
  const newBody = body;
  const transaction = await knex.transaction();
  try {
    const checkUser = await transaction(MODULE.BACK_OFFICE_USER)
      .select('*')
      .where({ email: newBody.email, tenant: newBody.tenant })
      .first();

    if (checkUser && Object.keys(checkUser).length > 0) {
      await transaction.rollback();
      const newError = new Error(`Email Exist`);
      newError.detail = `Email already exist`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const tenant = await transaction(MODULE.TENANT)
      .where('id', body.tenant)
      .first();

    if (!newBody.role) {
      const getRole = await transaction('role')
        .select('*')
        .where({ name: `${tenant.name}` })
        .first();

      newBody.role = getRole.id;
    }
    const user = await transaction(MODULE.BACK_OFFICE_USER)
      .insert(newBody)
      .returning('*');

    if (user.rowCount <= 0) {
      await transaction.rollback();
      const newError = new Error(`No Admin User`);
      newError.detail = `Admin User Data Is Not Provided`;
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
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const checkEmployeeLimit = async (tenant) => {
  const tenantResult = await findByTenant(tenant);

  const bindParams = {
    tenantId: tenantResult.id,
  };
  const user = await knex.raw(
    `
    SELECT COALESCE(COUNT(bu.id), 0) as user_counts
    FROM backoffice_user as bu
    LEFT JOIN backoffice_user ON bu.parent = backoffice_user.id
    WHERE backoffice_user.tenant = :tenantId
      AND bu.user_type = 'User' 
      AND bu.is_deleted = false;
  `,
    bindParams
  );

  if (
    user.rows.length &&
    Number(user.rows[0].user_counts) >= Number(tenantResult.employee_limit)
  ) {
    return false;
  }
  return true;
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

const findById = async (id) => {
  const columns = [
    'id',
    'username',
    'password',
    'tenant',
    'is_active',
    'is_deleted',
  ];
  const users = await knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where('id', id)
    .first();
  return users;
};

const findByUserTenantIdShop = (tenant) =>
  knex
    .select('*')
    .from(MODULE.BACK_OFFICE_USER)
    .where({ tenant, user_type: BACK_OFFICE_USER_TYPE.SHOP_USER })
    .first();

const findByUserTenantIdShopOrBranch = (tenant) =>
  knex
    .select('*')
    .from(MODULE.BACK_OFFICE_USER)
    .where({ tenant })
    .andWhere((qb) => {
      qb.orWhere('user_type', BACK_OFFICE_USER_TYPE.SHOP_USER);
      qb.orWhere('user_type', BACK_OFFICE_USER_TYPE.BRANCH_USER);
    })
    .first();

const findUserByAllTenants = async (email, domain) => {
  const systemConfig = await knex(MODULE.SYSTEM_CONFIG)
    .where('domain', domain)
    .whereNull('parent')
    .first();

  if (!systemConfig) {
    const newError = new Error(`No Shop Found`);
    newError.detail = `SHop is not found`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  const tenant = await knex
    .select('id')
    .from(MODULE.TENANT)
    .where('id', systemConfig.tenant)
    .orWhere('parent', systemConfig.tenant);

  const tenantIds = tenant.map((item) => item.id);

  const backofficeUser = await knex(MODULE.BACK_OFFICE_USER).whereIn(
    'tenant',
    tenantIds
  );

  return backofficeUser.find((item) => item.email === email);
};

const anonymousDetail = async (param) => {
  let findUser = await knex(MODULE.BACK_OFFICE_USER)
    .where('tenant', param.tenant)
    .first();

  if (findUser.parent) {
    findUser = await knex(MODULE.BACK_OFFICE_USER)
      .where('id', findUser.parent)
      .first();
  }

  return findUser;
};

module.exports = {
  listUsers,
  findUserById,
  createUser,
  findUserByEmail,
  findUserByCode,
  update,
  list,
  count,
  search,
  countWithSearch,
  edit,
  insert,
  checkEmployeeLimit,
  findByUserTenantId,
  profile,
  profileUpdate,
  findById,
  findByUserTenantIdShop,
  loginService,
  findUserByAllTenants,
  anonymousDetail,
  findByUserTenantIdShopOrBranch,
};
