/* eslint-disable camelcase */
const knex = require('../../../../config/databaseConnection');
const {
  BACK_OFFICE_USER_TYPE,
} = require('../../../../utils/constants/enumConstants');
const MODULE = require('../../../../utils/constants/moduleNames');

const list = async (param) => {
  const columns = [
    'backoffice_user.*',
    knex.raw('json_agg(role.name) -> 0 AS role_name'),
    knex.raw('json_agg(tenant.name) -> 0 AS tenant_name'),
    knex.raw('json_agg(tenant.max_user_limit) -> 0 AS max_user_limit'),
    knex.raw(
      `(SELECT COALESCE(COUNT(bu.id), 0) AS user_counts from backoffice_user as bu where bu.parent = backoffice_user.id AND user_type = 'User' AND is_deleted = false)`
    ),
  ];
  const users = await knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .leftJoin('role', 'backoffice_user.role', 'role.id')
    .leftJoin('tenant', 'backoffice_user.tenant', 'tenant.id')
    .where({ user_type: BACK_OFFICE_USER_TYPE.SHOP_USER, is_deleted: false })
    .groupBy('backoffice_user.id')
    .orderBy('backoffice_user.created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

  let newArr = [];
  if (users.length > 0) {
    newArr = users.map(
      ({
        username,
        password,
        code,
        parent,
        is_super_admin,
        role,
        user_type,
        ...rest
      }) => rest
    );
  }

  return newArr;
};

const count = async () =>
  knex(MODULE.BACK_OFFICE_USER)
    .count('id')
    .where({ is_super_admin: false, parent: null, is_deleted: false });

const search = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    isSuperAdmin: false,
    limit: param.size,
    offset: param.page * param.size,
  };
  const users = await knex.raw(
    `
  SELECT backoffice_user.*,
       json_agg(role.name) -> 0 AS role_name,
       json_agg(tenant.name) -> 0 AS tenant_name,
       json_agg(tenant.max_user_limit) -> 0 AS max_user_limit,
       (SELECT COALESCE(COUNT(bu.id), 0) AS user_counts from backoffice_user as bu where bu.parent = backoffice_user.id AND user_type = 'User' AND backoffice_user.is_deleted = false)
  FROM backoffice_user 
  LEFT JOIN role ON backoffice_user.role = role.id
  LEFT JOIN tenant ON backoffice_user.tenant = tenant.id
  WHERE is_super_admin = :isSuperAdmin and backoffice_user.parent IS NULL and backoffice_user.is_deleted = false
    AND (LOWER(first_name) LIKE LOWER(:search) OR LOWER(last_name) LIKE LOWER(:search) OR LOWER(email) LIKE LOWER(:search))
  GROUP BY backoffice_user.id
  ORDER BY created_date DESC 
  LIMIT :limit OFFSET :offset;
  `,
    bindParam
  );

  const newResult = users.rows;
  let newArr = [];
  if (newResult.length > 0) {
    newArr = newResult.map(
      ({
        username,
        password,
        code,
        parent,
        is_super_admin,
        role,
        user_type,
        ...rest
      }) => rest
    );
  }

  return newArr;
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    isSuperAdmin: false,
  };
  return knex.raw(
    `SELECT COALESCE(COUNT(id), 0) AS count FROM backoffice_user WHERE is_super_admin = :isSuperAdmin and backoffice_user.parent IS NULL and backoffice_user.is_deleted = false and (LOWER(first_name) LIKE LOWER(:search) OR LOWER(last_name) LIKE LOWER(:search) OR LOWER(email) LIKE LOWER(:search))`,
    bindParam
  );
};

const findById = (id) => {
  const columns = [
    'id',
    'username',
    'is_active',
    'is_deleted',
    'created_date',
    'email',
    'first_name',
    'last_name',
    'role',
    'avatar',
    'send_to_email',
    'tenant',
  ];
  return knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where('id', id)
    .first();
};

const detail = async (id) => {
  const user = await knex
    .select([
      'bu.*',
      knex.raw('json_agg(role.name) -> 0 AS role_name'),
      knex.raw('json_agg(t.name) -> 0 AS tenant_name'),
      knex.raw(`json_agg(t.max_user_limit) -> 0 AS max_user_limit`),
      knex.raw(
        `(SELECT COALESCE(COUNT(backoffice_user.id), 0) AS user_counts from backoffice_user WHERE backoffice_user.parent = bu.id AND user_type = 'User' AND is_deleted = false)`
      ),
    ])
    .from('backoffice_user as bu')
    .leftJoin('role', 'bu.role', 'role.id')
    .leftJoin('tenant AS t', 'bu.tenant', 't.id')
    .where({ 'bu.id': id, 'bu.is_deleted': false })
    .groupBy('bu.id')
    .first();

  const branchUser = await knex
    .select([
      'bu.*',
      knex.raw('json_agg(role.name) -> 0 AS role_name'),
      knex.raw('json_agg(t.name) -> 0 AS tenant_name'),
      knex.raw(`json_agg(t.max_user_limit) -> 0 AS max_user_limit`),
      knex.raw(
        `(SELECT COALESCE(COUNT(backoffice_user.id), 0) AS user_counts from backoffice_user WHERE backoffice_user.parent = bu.id AND user_type = 'User' AND is_deleted = false)`
      ),
    ])
    .from('backoffice_user as bu')
    .leftJoin('role', 'bu.role', 'role.id')
    .leftJoin('tenant AS t', 'bu.tenant', 't.id')
    .where({
      'bu.parent': id,
      'bu.user_type': BACK_OFFICE_USER_TYPE.BRANCH_USER,
      'bu.is_deleted': false,
    })
    .groupBy('bu.id');

  let newArr = [];

  if (branchUser.length > 0) {
    newArr = branchUser.map(
      ({
        username,
        password,
        code,
        parent,
        is_super_admin,
        role,
        user_type,
        ...rest
      }) => rest
    );
  }

  const finalResult = {
    id: user.id,
    is_active: user.is_active,
    is_deleted: user.is_deleted,
    created_by: user.created_by,
    updated_by: user.updated_by,
    created_date: user.created_date,
    updated_date: user.updated_date,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    avatar: user.avatar,
    send_to_email: user.send_to_email,
    max_user_limit: user.max_user_limit,
    user_counts: user.user_counts,
    tenant_name: user.tenant_name,
    role_name: user.role_name,
    branchUsers: newArr,
  };

  return finalResult;
};

module.exports = { list, count, search, countWithSearch, findById, detail };
