const { v4: uuidv4 } = require('uuid');
const knex = require('../../../../config/databaseConnection');
const { SERVER_BASE_PATH } = require('../../../../utils/commonUtil');
const { toKebabCase } = require('../../../../utils/commonUtils/caseConversion');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const list = async () => {
  const columns = [
    'id',
    'name',
    'desc',
    'permission_sequence',
    'permission_parent',
    'created_by',
    'is_active'
  ];
  return knex
    .select(columns)
    .from(MODULE.PERMISSION)
    .where('is_active', true)
    .orderBy('created_date', 'ASC');
};

const findById = async (id) => {
  const columns = ['id', 'name', 'desc', 'permission_sequence', 'created_by'];
  return knex.select(columns).from(MODULE.PERMISSION).where('id', id);
};

const create = async (data) => knex(MODULE.PERMISSION).insert(data);

const paginationList = async (param) => {
  const columns = [
    'id',
    'name',
    'desc',
    'permission_type',
    'is_active',
    'created_date',
  ];
  return knex
    .select(columns)
    .from(MODULE.PERMISSION)
    .where('permission_parent', null)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};

const count = async () =>
  knex(MODULE.PERMISSION).count('id').where('permission_parent', null);

const search = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    permissionParent: null,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM permission WHERE LOWER(name) LIKE LOWER(:search) OR LOWER(action) LIKE LOWER(:search) and permission_parent = :permissionParent ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    permissionParent: null,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM permission WHERE LOWER(name) LIKE LOWER(:search) OR LOWER(action) LIKE LOWER(:search) and permission_parent = :permissionParent`,
    bindParam
  );
};

const update = async (data, id) =>
  knex(MODULE.PERMISSION).update(data).where('id', id);

const createTransaction = async (body) => {
  const transaction = await knex.transaction();
  try {
    const permissionCheck = await transaction(MODULE.PERMISSION)
      .select('*')
      .where('name', body.name);

    if (permissionCheck && permissionCheck.length > 0) {
      await transaction.rollback();
      const newError = new Error(`No Permission`);
      newError.detail = `Permission Already Exist.`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const permissionData = {
      id: uuidv4(),
      name: body.name,
      desc: body.desc,
      is_active: true,
      permission_type: body.permission_type,
      created_by: body.created_by,
      updated_by: body.created_by,
    };
    const permission = await transaction(MODULE.PERMISSION)
      .insert(permissionData)
      .returning('*');

    if (permission.rowCount <= 0) {
      await transaction.rollback();
      const newError = new Error(`No Permission`);
      newError.detail = `Permission Data Is Not Provided`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const apiLink = `${SERVER_BASE_PATH}/admin/`;
    const urlParam = toKebabCase({ txt: permission[0].name }).txt;
    const newArr = await Promise.all(
      body.data.map(async (item, index) => {
        const permissionIsCheck = await transaction(MODULE.PERMISSION)
          .select('*')
          .where('name', item.name);
        if (permissionIsCheck.length === 0) {
          const newData = {
            id: uuidv4(),
            is_active: true,
            permission_sequence: index + 1,
            permission_parent: permission[0].id,
            permission_type: body.permission_type,
            created_by: body.created_by,
            updated_by: body.created_by,
            name: item.name,
            desc: item.desc,
            action: `${apiLink + urlParam}/${item.action}`,
            show_on_menu: item.show_on_menu,
          };
          return newData;
        }
        await transaction.rollback();
        const newError = new Error(`No Permission`);
        newError.detail = `Permission Already Exist.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      })
    );

    if (newArr && newArr.length > 0) {
      const permissionChild = await transaction(MODULE.PERMISSION).insert(
        newArr
      );

      if (permissionChild.rowCount <= 0) {
        await transaction.rollback();
        const newError = new Error(`No Permission Child`);
        newError.detail = `Permission Child Data Is Not Provided`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    } else {
      await transaction.rollback();
      const newError = new Error(`No Permission Child`);
      newError.detail = `Permission Child Data Is Not Provided`;
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
    return permission;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const childListOnly = async (id) => {
  const columns = [
    'id',
    'name',
    'desc',
    'permission_sequence',
    'permission_parent',
    'action',
    'permission_type',
    'is_active',
    'show_on_menu',
    'created_date',
  ];

  return knex
    .select(columns)
    .from(MODULE.PERMISSION)
    .where('permission_parent', id)
    .orderBy('created_date', 'desc');
};

const updateTransaction = async (body, id) => {
  const transaction = await knex.transaction();
  try {
    let permissions = await childListOnly(id);
    const permissionParentCheck = await transaction(MODULE.PERMISSION)
      .select('*')
      .where('name', body.name);

    let permissionUpdateData;
    if (permissionParentCheck.length > 0) {
      permissionUpdateData = {
        desc: body.desc,
        permission_type: body.permission_type,
        updated_by: body.updated_by,
      };
    } else {
      permissionUpdateData = {
        name: body.name,
        desc: body.desc,
        permission_type: body.permission_type,
        updated_by: body.updated_by,
      };
    }
    const permissionUpdate = await transaction(MODULE.PERMISSION)
      .update(permissionUpdateData)
      .where('id', id);

    if (!permissionUpdate) {
      await transaction.rollback();
      const newError = new Error(`Permission Not Update`);
      newError.detail = `Permission Update Query Not Execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const apiLink = `${SERVER_BASE_PATH}/admin/`;
    const urlParam = toKebabCase({ txt: body.name }).txt;
    let index = permissions.length;
    await Promise.all(
      body.data.map(async (item) => {
        const dataItem = item;
        const permissionChildCheck = await transaction(MODULE.PERMISSION)
          .select('*')
          .where('name', dataItem.name);

        if (dataItem.id) {
          permissions = permissions.filter(
            (filterItem) => filterItem.id !== dataItem.id
          );
          let childUpdateData;
          if (permissionChildCheck.length > 0) {
            childUpdateData = {
              desc: dataItem.desc,
              action: dataItem.action,
              permission_type: dataItem.permission_type,
              show_on_menu: dataItem.show_on_menu,
              is_active: dataItem.is_active,
              updated_by: dataItem.updated_by,
            };
          } else {
            childUpdateData = {
              name: dataItem.name,
              desc: dataItem.desc,
              action: dataItem.action,
              permission_type: dataItem.permission_type,
              show_on_menu: dataItem.show_on_menu,
              is_active: dataItem.is_active,
              updated_by: dataItem.updated_by,
            };
          }

          const childUpdate = await transaction(MODULE.PERMISSION)
            .update(childUpdateData)
            .where('id', dataItem.id);

          if (!childUpdate) {
            await transaction.rollback();
            const newError = new Error(`Permission Not Update`);
            newError.detail = `Permission Update Query Not Execute`;
            newError.code = HTTP_STATUS.BAD_REQUEST;
            throw newError;
          }
        } else if (permissionChildCheck.length <= 0) {
          delete dataItem.id;
          index += 1;
          const childCreateData = {
            id: uuidv4(),
            is_active: true,
            permission_sequence: index,
            permission_parent: id,
            permission_type: body.permission_type,
            created_by: dataItem.updated_by,
            updated_by: dataItem.updated_by,
            name: dataItem.name,
            desc: dataItem.desc,
            action: `${apiLink + urlParam}/${dataItem.action}`,
            show_on_menu: dataItem.show_on_menu,
          };
          const childCreate = await transaction(MODULE.PERMISSION).insert(
            childCreateData
          );

          if (childCreate.rowCount <= 0) {
            await transaction.rollback();
            const newError = new Error(`No Permission Child`);
            newError.detail = `Permission Child Data Is Not Provided`;
            newError.code = HTTP_STATUS.BAD_REQUEST;
            throw newError;
          }
        }
      })
    );
    const delIds = [];
    if (permissions && permissions.length > 0) {
      permissions.forEach((item) => {
        delIds.push(item.id);
      });
      if (delIds.length > 0) {
        const deletePermission = await transaction(MODULE.PERMISSION)
          .update({ is_active: false, show_on_menu: false })
          .where((builder) => builder.whereIn('id', delIds));

        if (!deletePermission) {
          await transaction.rollback();
          const newError = new Error(`Permission Not Delete`);
          newError.detail = `Permission Delete Query Not Execute`;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
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

    return permissionUpdate;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getPermission = async (id) => {
  const permission = await knex(MODULE.PERMISSION)
    .select('*')
    .where('id', id)
    .first();

  const childPermission = await knex(MODULE.PERMISSION)
    .select('*')
    .where({ permission_parent: id, is_active: true });

  const newData = {
    id: permission.id,
    name: permission.name,
    desc: permission.desc,
    permission_type: permission.permission_type,
    data: childPermission,
  };
  return newData;
};

const updateStatus = async (body, id) =>
  knex(MODULE.PERMISSION)
    .update(body)
    .where('id', id)
    .orWhere('permission_parent', id);

const childList = async (param) => {
  const columns = [
    'id',
    'name',
    'desc',
    'permission_sequence',
    'permission_parent',
    'action',
    'permission_type',
    'is_active',
    'show_on_menu',
    'created_date',
  ];

  return knex
    .select(columns)
    .from(MODULE.PERMISSION)
    .where('permission_parent', param.id)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);
};

const childCount = async (param) =>
  knex(MODULE.PERMISSION).count('id').where('permission_parent', param.id);

const childSearch = (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    permissionParent: param.id,
    limit: param.size,
    offset: param.page * param.size,
  };
  return knex.raw(
    `SELECT * FROM permission WHERE permission_parent = :permissionParent AND (LOWER(name) LIKE LOWER(:search) OR LOWER(action) LIKE LOWER(:search)) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
};

const childCountWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    permissionParent: param.id,
  };
  return knex.raw(
    `SELECT COUNT(id) AS count FROM permission WHERE permission_parent = :permissionParent AND (LOWER(name) LIKE LOWER(:search) OR LOWER(action) LIKE LOWER(:search))`,
    bindParam
  );
};

const childUpdateStatus = async (body, id) =>
  knex(MODULE.PERMISSION).update(body).where('id', id);

module.exports = {
  list,
  findById,
  create,
  paginationList,
  count,
  childList,
  search,
  countWithSearch,
  update,
  createTransaction,
  updateTransaction,
  getPermission,
  updateStatus,
  childCount,
  childSearch,
  childCountWithSearch,
  childUpdateStatus,
};
