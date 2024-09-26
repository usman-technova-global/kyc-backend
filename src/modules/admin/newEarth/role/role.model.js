const { v4: uuidv4 } = require('uuid');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = (param /* logger */) => {
  const columns = ['id', 'name', 'desc', 'created_date', 'tenant', 'is_active'];
  return knex
    .select(columns)
    .from(MODULE.ROLE)
    .where('tenant', param.tenant)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};

const listForSuperAdmin = (param /* logger */) => {
  const columns = ['id', 'name', 'desc', 'created_date', 'tenant', 'is_active'];
  return knex
    .select(columns)
    .from(MODULE.ROLE)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};

const count = async (tenant) =>{
  if(tenant){
  return  knex(MODULE.ROLE).where('tenant', tenant).count('id')

  }else{
    return  knex(MODULE.ROLE).count('id')

  }
}
 ;

const findById = (id) =>
  knex.select('*').from(MODULE.ROLE).where('id', id).first();
const findByName = (name) =>
  knex.select('*').from(MODULE.ROLE).where('name', name).first();

const findByNameAndTenant = (name, tenant) =>
  knex.select('*')
      .from(MODULE.ROLE)
      .where('name', name)
      .andWhere('tenant', tenant)
      .first();

const findByNameAndId = (id, name) =>
  knex
    .select('*')
    .from(MODULE.ROLE)
    .whereNot('id', id)
    .andWhere('name', name)
    .first();

const create = async (body) => {
  const transaction = await knex.transaction();
  try {
    const newData = [];
    // const superAdmin = await transaction(MODULE.BACK_OFFICE_USER)
    //   .select('*')
    //   .where('is_super_admin', true)
    //   .first();

    const roleData = {
      id: uuidv4(),
      name: body.name,
      desc: body.desc,
      tenant: body.tenant,
      is_active: true,
      created_by: body.userId,
      updated_by: body.userId,
    };
    const role = await transaction(MODULE.ROLE).insert(roleData).returning('*');

    if (role.rowCount <= 0) {
      await transaction.rollback();
      const newError = new Error(`No Role`);
      newError.detail = `Role Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    // role[0].id
    body.data.forEach(async (newItem) => {
      newItem.data.forEach(async (item) => {
        const rolePermissionData = {
          id: uuidv4(),
          role_id: role[0].id,
          permission_id: item.id,
          created_by: body.userId,
          updated_by: body.userId,
        };
        if (item.status) {
          rolePermissionData.is_active = true;
        } else {
          rolePermissionData.is_active = false;
        }
        newData.push(rolePermissionData);
      });
    });

    if (newData.length <= 0) {
      await transaction.rollback();
      const newError = new Error(`No Role Permission Data Available`);
      newError.detail = `Role permission Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const rolePermission = await transaction(MODULE.ROLE_PERMISSION).insert(
      newData
    );

    if (rolePermission.rowCount <= 0) {
      await transaction.rollback();
      const newError = new Error(`No Role Permission Insert`);
      newError.detail = `Role permission Is Not Inserting`;
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

    return role;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const findPermissionsById = (roleId) =>
  knex.select('*').from(MODULE.ROLE_PERMISSION).where('role_id', roleId);

const findPermissions = () =>
  knex.select('*').from(MODULE.ROLE_PERMISSION);

const update = async (roleId, body) => {
  const transaction = await knex.transaction();
  try {
    const activeIds = [];
    const inactiveIds = [];

    const superAdmin = await transaction(MODULE.BACK_OFFICE_USER)
      .select('*')
      .where('is_super_admin', true)
      .first();

    const rolePermissionList = await findPermissionsById(roleId);

    const roleData = {
      name: body.name,
      desc: body.desc,
      updated_by: superAdmin.id,
    };
    const role = await transaction(MODULE.ROLE)
      .update(roleData)
      .where('id', roleId);

    if (!role) {
      await transaction.rollback();
      const newError = new Error(`No Role Found`);
      newError.detail = `Role id not found.`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const newData = [];
    body.data.forEach(async (newItem) => {
      newItem.data.forEach(async (item) => {
        const filterDat = rolePermissionList.filter(
          (filterItem) =>
            filterItem.role_id === roleId &&
            filterItem.permission_id === item.id
        );
        if (filterDat.length > 0) {
          if (item.status) {
            activeIds.push(item.id);
          } else {
            inactiveIds.push(item.id);
          }
        } else {
          newData.push({
            id: uuidv4(),
            role_id: roleId,
            permission_id: item.id,
            created_by: superAdmin.id,
            updated_by: superAdmin.id,
            is_active: true,
          });
        }
      });
    });
    if (activeIds.length > 0) {
      const rolePermissionActive = await transaction(MODULE.ROLE_PERMISSION)
        .update({ is_active: true })
        .where('role_id', roleId)
        .where((builder) => builder.whereIn('permission_id', activeIds));

      if (rolePermissionActive <= 0) {
        await transaction.rollback();
        const newError = new Error(`No Role Permission Update`);
        newError.detail = `Role permission is not update.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    if (inactiveIds.length > 0) {
      const rolePermissionInactive = await transaction(MODULE.ROLE_PERMISSION)
        .update({ is_active: false })
        .where('role_id', roleId)
        .where((builder) => builder.whereIn('permission_id', inactiveIds));

      if (rolePermissionInactive <= 0) {
        await transaction.rollback();
        const newError = new Error(`No Role Permission Update`);
        newError.detail = `Role permission is not update.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }
    if (newData.length > 0) {
      const rolePermission = await transaction(MODULE.ROLE_PERMISSION)
        .insert(newData)
        .returning('*');

      if (rolePermission.rowCount <= 0) {
        await transaction.rollback();
        const newError = new Error(`No Role Permission`);
        newError.detail = `Role Permission Data Is Not Provided`;
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

    return role;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const search = (param) => {
  const bindParam = {
    tenant: param.tenant,
    search: `%${param.search}%`,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM role WHERE tenant = :tenant AND LOWER(name) LIKE LOWER(:search) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    tenant: param.tenant,
    search: `%${param.search}%`,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM role WHERE tenant = :tenant AND LOWER(name) LIKE LOWER(:search)`,
    bindParam
  );
};

const updateStatus = async (data, id) =>
  knex(MODULE.ROLE).update(data).where('id', id);

const getRoles = (tenant) => {
  const columns = ['id', 'name', 'desc', 'created_date', 'tenant', 'is_active'];
  return knex
    .select(columns)
    .from(MODULE.ROLE)
    .where('is_active', true)
    .andWhere('name', '!=', 'Super Admin')
    .andWhere('tenant', tenant)
    .orderBy('created_date', 'desc');
};

module.exports = {
  list,
  count,
  findById,
  findByName,
  findByNameAndId,
  create,
  findPermissionsById,
  findPermissions,
  update,
  search,
  countWithSearch,
  updateStatus,
  getRoles,
  listForSuperAdmin,
  findByNameAndTenant,
  
};
