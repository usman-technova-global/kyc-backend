/* eslint-disable camelcase */
const knex = require('../../../config/databaseConnection');
const {
  BACK_OFFICE_USER_TYPE,
} = require('../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');
const logger = require('../../../utils/commonUtils/logger').adminLogger;

const list = async (param) => {
  const tenant = await knex
    .select('*')
    .from(MODULE.TENANT)
    .where('parent', param.tenant)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

  const newArr = [];
  if (tenant.length > 0) {
    await Promise.all(
      tenant.map(async (item) => {
        const userCounts = await knex('backoffice_user').count('id').where({
          tenant: item.id,
          user_type: BACK_OFFICE_USER_TYPE.USER,
          is_active: true,
          is_deleted: false,
        });

        const tenant_config = await knex
          .select('*')
          .from('tenant_config')
          .where('id', item.tenant_config)
          .first();

        newArr.push({
          ...item,
          user_counts: Number(userCounts[0].count),
          tenant_config,
        });
      })
    );
  }
  return newArr;
};

const count = async (param) =>
  knex(MODULE.TENANT).count('id').where('parent', param.tenant);

const search = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    id: param.tenant,
    limit: param.size,
    offset: param.page * param.size,
  };
  const tenant = await knex.raw(
    `SELECT *
    FROM tenant 
    WHERE parent = :id and LOWER(name) LIKE LOWER(:search) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
  const newArr = [];
  if (tenant.length > 0) {
    await Promise.all(
      tenant.map(async (item) => {
        const backOfficeUser = await knex('backoffice_user').count('id').where({
          tenant: param.tenant,
          user_type: BACK_OFFICE_USER_TYPE.USER,
          is_active: true,
          is_deleted: false,
        });

        const tenant_config = await knex
          .select('*')
          .from('tenant_config')
          .where('id', item.tenant_config)
          .first();

        newArr.push({
          ...item,
          user_counts: Number(backOfficeUser[0].count),
          tenant_config,
        });
      })
    );
  }
  return newArr;
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    id: param.tenant,
  };
  return knex.raw(
    `SELECT COALESCE(COUNT(id), 0) AS count FROM tenant WHERE parent = :id and LOWER(name) LIKE LOWER(:search)`,
    bindParam
  );
};

const detail = async (tenantId) => {
  const branchUser = await knex(MODULE.BACK_OFFICE_USER)
    .where({
      tenant: tenantId,
      user_type: BACK_OFFICE_USER_TYPE.BRANCH_USER,
    })
    .first();

  const branchUsers = await knex(MODULE.BACK_OFFICE_USER).where({
    parent: branchUser.id,
    user_type: BACK_OFFICE_USER_TYPE.USER,
  });

  let newResult;
  if (branchUsers.length > 0) {
    // remove keys from branches array of object
    newResult = branchUsers.map(
      ({
        created_by,
        updated_by,
        send_to_email,
        password,
        parent,
        is_super_admin,
        role,
        password_type,
        user_type,
        code,
        tenant,
        ...rest
      }) => rest
    );
  } else {
    newResult = [];
  }
  const newData = {
    id: branchUser.id,
    username: branchUser.username,
    is_active: branchUser.is_active,
    created_date: branchUser.created_date,
    updated_date: branchUser.updated_date,
    email: branchUser.email,
    first_name: branchUser.first_name,
    last_name: branchUser.last_name,
    avatar: branchUser.avatar,
    is_deleted: branchUser.is_deleted,
    branchUsers: newResult,
  };
  return newData;
};

const insert = async (tenantId, tenantData, parole) => {
  const transaction = await knex.transaction();
  try {
    const findTenant = await knex('tenant').where('id', tenantId).first();
    const findTenantConfig = await knex('tenant_config')
      .where('id', findTenant.tenant_config)
      .first();
    const tenantUserLimitCount = await knex('tenant')
      .sum('user_limit')
      .where('id', tenantId)
      .orWhere('parent', tenantId);

    const totalUsersLimits =
      Number(tenantUserLimitCount[0].sum) + Number(tenantData.user_limit);

    if (totalUsersLimits > Number(findTenant.max_user_limit)) {
      const newError = new Error(`User limit exceed`);
      newError.detail = `User limit exceed. Please contact admin`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const roleTable = await knex
      .select('*')
      .from('role')
      .where('name', `${findTenant.name}`)
      .first();

    const user = await knex(MODULE.BACK_OFFICE_USER)
      .where({ tenant: tenantId, user_type: 'ShopUser' })
      .first();

    const tenantConfig = await transaction(MODULE.TENANT_CONFIG)
      .insert({
        name: tenantData.tenant_name,
        desc: `For ${tenantData.tenant_name} Description`,
        created_by: user.id,
        updated_by: user.id,
        gst_percentage: '10.0',
        shop_address: tenantData.address,
        theme: findTenantConfig.theme,
      })
      .returning('*');

    if (!tenantConfig) {
      await transaction.rollback();
      const newError = new Error(`No Tenant Config Create`);
      newError.detail = `Tenant config service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const tenant = await transaction(MODULE.TENANT)
      .insert({
        name: tenantData.tenant_name,
        is_active: true,
        created_by: user.id,
        updated_by: user.id,
        tenant_config: tenantConfig[0].id,
        parent: findTenant.id,
        trial_mode: findTenant.trial_mode,
        trial_start_date: findTenant.trial_start_date,
        trial_mode_limit: findTenant.trial_mode_limit,
        user_limit: tenantData.user_limit,
        tenant_type: 'Branch',
      })
      .returning('*');

    if (!tenant) {
      await transaction.rollback();
      const newError = new Error(`No Tenant Create`);
      newError.detail = `Tenant service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const backofficeUser = await transaction(MODULE.BACK_OFFICE_USER)
      .insert({
        username: tenantData.email,
        password: parole,
        is_active: true,
        created_by: user.id,
        updated_by: user.id,
        email: tenantData.email,
        is_super_admin: false,
        tenant: tenant[0].id,
        first_name: tenantData.first_name,
        last_name: tenantData.last_name,
        role: roleTable.id,
        user_type: 'BranchUser',
        password_type: 'New',
        parent: tenantData.user_id,
      })
      .returning('*');

    if (!backofficeUser) {
      await transaction.rollback();
      const newError = new Error(`No Backoffice User Create`);
      newError.detail = `Backoffice User service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    const appUserEmail = tenantData.email.split('@');
    const appUser = await transaction(MODULE.APP.USER)
      .insert({
        password: parole,
        email: `${appUserEmail[0]}@shop.com`,
        is_active: true,
        created_by: user.id,
        updated_by: user.id,
        tenant: tenant[0].id,
        first_name: tenantData.first_name,
        last_name: tenantData.last_name,
        status: 'Offline',
        user_type: 'Shop',
      })
      .returning('*');

    if (!appUser) {
      await transaction.rollback();
      const newError = new Error(`No Backoffice User Create`);
      newError.detail = `Backoffice User service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const appUserAddress = await transaction(MODULE.APP.USER_ADDRESS)
      .insert({
        name: `${tenantData.first_name} ${tenantData.last_name}`,
        address: tenantData.address,
        app_user: appUser[0].id,
        tenant: tenant[0].id,
        latitude: 0,
        longitude: 0,
        type: 'Office',
        is_active: true,
      })
      .returning('*');

    if (!appUserAddress) {
      await transaction.rollback();
      const newError = new Error(`No App User Address Create`);
      newError.detail = `App user address service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // const homeCategory = await transaction(MODULE.HOME_CATEGORY)
    //   .insert([
    //     {
    //       name: 'Commercial',
    //       desc: 'this is ponchos',
    //       icon: 'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/menu/1d6f0e45-37c1-4975-af97-2bdeafdb4d6b-Commercial.png',
    //       banner:
    //         'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/menu/f089ac10-aff9-40c9-a7e8-5493007d1ca6-Commercial.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       tenant: tenant[0].id,
    //       is_active: true,
    //       is_deleted: false,
    //     },
    //     {
    //       name: 'Iron',
    //       desc: 'this is ponchos',
    //       icon: 'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/menu/58b7a298-76c1-498e-b839-b5cd6a91afba-iron.png',
    //       banner:
    //         'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/menu/58b7a298-76c1-498e-b839-b5cd6a91afba-iron.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       tenant: tenant[0].id,
    //       is_active: true,
    //       is_deleted: false,
    //     },
    //   ])
    //   .returning('*');

    // if (!homeCategory) {
    //   await transaction.rollback();
    //   const newError = new Error(`No Home Category Create`);
    //   newError.detail = `Home category service is not execute`;
    //   newError.code = HTTP_STATUS.BAD_REQUEST;
    //   throw newError;
    // }

    // const homeCatItem = await transaction(MODULE.HOME_CATEGORY_ITEM)
    //   .insert([
    //     {
    //       name: 'Hospital Curtains',
    //       desc: 'this is hospital curtains',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/commercial/banner/hospital-curtain.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/commercial/banner/hospital-curtain.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '15.67',
    //       home_category: homeCategory[0].id,
    //       quantity: 0,
    //     },
    //     {
    //       name: 'Pillow Case',
    //       desc: 'this is pillow case',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/commercial/banner/pillow-case.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/commercial/banner/pillow-case.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '19.00',
    //       home_category: homeCategory[0].id,
    //       quantity: 0,
    //     },
    //     {
    //       name: 'Bed Blanket',
    //       desc: 'this is bed blanket',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/commercial/banner/bed-blanket.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/commercial/banner/bed-blanket.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '14.00',
    //       home_category: homeCategory[0].id,
    //       quantity: 0,
    //     },
    //     {
    //       name: 'Wastern Shirt',
    //       desc: 'this is western shirt',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/wastern-shirt.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/wastern-shirt.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '6.00',
    //       home_category: homeCategory[1].id,
    //       quantity: 0,
    //     },
    //     {
    //       name: 'Blazer Suit',
    //       desc: 'this is blazer suit',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/blazer-suit.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/blazer-suit.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '4.00',
    //       home_category: homeCategory[1].id,
    //       quantity: 0,
    //     },
    //     {
    //       name: 'Dress Pant',
    //       desc: 'this is dress pant',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/dress-pant.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/dress-pant.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '3.00',
    //       home_category: homeCategory[1].id,
    //       quantity: 0,
    //     },
    //     {
    //       name: 'Sky Shirt',
    //       desc: 'this is sky shirt',
    //       icon: 'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/sky-shirt.png',
    //       banner:
    //         'https://laundry-app.s3.ca-central-1.amazonaws.com/619943ef-8e9f-4a74-9e1e-4b299d19330d/theme/sub_menu/iron/icon/sky-shirt.png',
    //       created_by: user.id,
    //       updated_by: user.id,
    //       is_active: true,
    //       is_deleted: false,
    //       price: '2.00',
    //       home_category: homeCategory[1].id,
    //       quantity: 0,
    //     },
    //   ])
    //   .returning('*');

    // if (!homeCatItem) {
    //   await transaction.rollback();
    //   const newError = new Error(`No Home Category Item Create`);
    //   newError.detail = `Home category item service is not execute`;
    //   newError.code = HTTP_STATUS.BAD_REQUEST;
    //   throw newError;
    // }

    const findSystemConfig = await transaction(MODULE.SYSTEM_CONFIG)
      .where('tenant', findTenant.id)
      .first();

    const systemConfig = await transaction(MODULE.SYSTEM_CONFIG)
      .insert({
        domain: findSystemConfig.domain,
        theme: JSON.stringify(findSystemConfig.theme),
        tenant: tenant[0].id,
        parent: findTenant.id,
      })
      .returning('*');

    if (!systemConfig) {
      await transaction.rollback();
      const newError = new Error(`No System Config Create`);
      newError.detail = `System config service is not execute`;
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
    return {
      success: true,
      message: 'All tables are successfully created.',
      inserted_ids: {
        tenant: tenant[0].id,
        backoffice_user: backofficeUser[0].id,
      },
    };
  } catch (error) {
    await transaction.rollback();
    logger.error(
      `Error:: ${error}
      Trace:: ${error.stack}`
    );
    throw error;
  }
};

const update = async (body, tenantId) => {
  const transaction = await knex.transaction();
  try {
    const userId = body.user_id;
    const findTenant = await transaction(MODULE.TENANT)
      .select('*')
      .where('id', tenantId)
      .first();

    const tenantParent = await knex(MODULE.TENANT)
      .where('id', findTenant.parent)
      .first();

    if (Number(findTenant.user_limit) !== Number(body.user_limit)) {
      const tenantUserLimitCount = await knex('tenant')
        .sum('user_limit')
        .where('id', findTenant.parent)
        .orWhere('parent', findTenant.parent)
        .andWhereNot('id', tenantId);

      const totalUsersLimits =
        Number(tenantUserLimitCount[0].sum) + Number(body.user_limit);

      if (totalUsersLimits > Number(tenantParent.max_user_limit)) {
        const newError = new Error(`User limit exceed`);
        newError.detail = `User limit exceed. Please contact admin`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
    }

    if (findTenant && Object.keys(findTenant).length > 0) {
      if (findTenant.name !== body.tenant_name) {
        const tenantCheck = await transaction(MODULE.TENANT)
          .select('*')
          .where('name', body.tenant_name)
          .andWhereNot('id', tenantId);

        if (tenantCheck.length > 0) {
          await transaction.rollback();
          const newError = new Error(`No Tenant Update`);
          newError.detail = `Tenant Is Already Exist.`;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
      }

      const tenantUpdateData = {
        user_limit: body.user_limit,
        updated_by: userId,
      };
      if (findTenant.name !== body.tenant_name) {
        tenantUpdateData.name = body.tenant_name;
        const tenantConfigUpdateData = {
          name: body.tenant_name,
          updated_by: userId,
        };

        const tenantConfigUpdate = await transaction(MODULE.TENANT_CONFIG)
          .update(tenantConfigUpdateData)
          .where('id', findTenant.tenant_config);

        if (!tenantConfigUpdate) {
          await transaction.rollback();
          const newError = new Error(`No Tenant Config Update`);
          newError.detail = `Tenant Config Data Not Provided.`;
          newError.code = HTTP_STATUS.BAD_REQUEST;
          throw newError;
        }
      }

      const tenantUpdate = await transaction(MODULE.TENANT)
        .update(tenantUpdateData)
        .where('id', tenantId);

      if (!tenantUpdate) {
        await transaction.rollback();
        const newError = new Error(`No Tenant Update`);
        newError.detail = `Tenant Data Not Provided.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      const backOfficeUpdateData = {
        first_name: body.first_name,
        last_name: body.last_name,
      };

      const roleTable = await knex
        .select('*')
        .from('role')
        .where('name', `${findTenant.name}`)
        .first();

      backOfficeUpdateData.role = roleTable.id;

      const backOfficeUpdate = await transaction(MODULE.BACK_OFFICE_USER)
        .update(backOfficeUpdateData)
        .where({
          tenant: tenantId,
          user_type: BACK_OFFICE_USER_TYPE.BRANCH_USER,
        });

      if (!backOfficeUpdate) {
        await transaction.rollback();
        const newError = new Error(`No User Update`);
        newError.detail = `User Data Not Provided.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }

      const findSystemConfig = await transaction(MODULE.SYSTEM_CONFIG)
        .where('tenant', findTenant.parent)
        .first();

      const systemConfig = await transaction(MODULE.SYSTEM_CONFIG)
        .insert({
          tenant: tenantId,
          theme: JSON.stringify(findSystemConfig.theme),
          domain: body.domain,
        })
        .onConflict('tenant')
        .merge()
        .returning('*');

      if (!systemConfig) {
        await transaction.rollback();
        const newError = new Error(`No System Config Update`);
        newError.detail = `System config is not updated.`;
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
      return tenantUpdate;
    }
    await transaction.rollback();
    const newError = new Error(`No Tenant Found`);
    newError.detail = `Tenant Is Not Found.`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateStatus = async (id, data) => {
  const transaction = await knex.transaction();
  try {
    const tenant = await knex(MODULE.TENANT).where('id', id).first();
    const newData = {
      is_active: data.is_active,
      trial_mode: data.is_active,
    };
    // if (item.trial_start_date) {
    //   newData.trial_mode = data.is_active;
    //   if (data.is_active) {
    //     newData.trial_start_date = moment().format('YYYY-MM-DD HH:mm:ss');
    //   }
    // }
    const updateStatusQuery = knex(MODULE.TENANT)
      .update(newData)
      .where('id', id);
    const backOfficeUserQuery = knex(MODULE.BACK_OFFICE_USER)
      .update({ is_active: data.is_active, is_deleted: !data.is_active })
      .where('tenant', tenant.id);

    let appUserQuery = null;
    const appUsers = await knex('app_user').where('tenant', tenant.id);
    if (appUsers) {
      appUserQuery = knex('app_user')
        .update({ is_active: data.is_active, is_deleted: !data.is_active })
        .where('tenant', tenant.id);
    }

    const updateResult = await Promise.all([
      updateStatusQuery,
      backOfficeUserQuery,
      appUserQuery,
    ]).catch(async (error) => {
      logger.error(
        `Error:: ${error}
        Trace:: ${error.stack}`
      );
      await transaction.rollback();
      const newError = new Error(`No Status Update Tenant and Users`);
      newError.detail = `Tenant and use status is not updated.`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    });

    return updateResult;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const employeeCounts = async (id) => {
  const tenantIds = (
    await knex.select('id').from('tenant').where('id', id).orWhere('parent', id)
  ).map((item) => item.id);

  const tenantUserLimitCount = await knex('backoffice_user')
    .count('id')
    .whereIn('tenant', tenantIds)
    .where({
      user_type: BACK_OFFICE_USER_TYPE.USER,
      is_active: true,
      is_deleted: false,
    });

  return tenantUserLimitCount;
};

const employeeLimitCounts = async (tenantId) =>
  knex('tenant')
    .sum('user_limit')
    .where('id', tenantId)
    .orWhere('parent', tenantId);

module.exports = {
  list,
  count,
  search,
  countWithSearch,
  detail,
  insert,
  update,
  updateStatus,
  employeeCounts,
  employeeLimitCounts,
};
