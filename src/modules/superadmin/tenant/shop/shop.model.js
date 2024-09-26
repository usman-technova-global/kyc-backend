/* eslint-disable camelcase */
const moment = require('moment');
const knex = require('../../../../config/databaseConnection');
const { findByTenant } = require('../tenant.model');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  BACK_OFFICE_USER_TYPE,
} = require('../../../../utils/constants/enumConstants');
const logger = require('../../../../utils/commonUtils/logger').adminLogger;
const { DEFAULT } = require('../../../../utils/commonUtil');

const tenantList = async (param) => {
  const tenant = await knex
    .select('*')
    .from(MODULE.TENANT)
    .where('parent', null)
    .orderBy('created_date', 'desc')
    .limit(param.size)
    .offset(param.page * param.size);

  const newArr = [];
  if (tenant.length > 0) {
    await Promise.all(
      tenant.map(async (item) => {
        const allTenants = await knex
          .select('id')
          .from('tenant')
          .where('id', item.id)
          .orWhere('parent', item.id);
        const tenantIds = allTenants.map((tenantItem) => tenantItem.id);
        const backofficeUser = await knex('backoffice_user')
          .count('id')
          .whereIn('tenant', tenantIds)
          .where({
            user_type: BACK_OFFICE_USER_TYPE.USER,
            is_active: true,
            is_deleted: false,
          });

        const tenantConfig = await knex
          .select('*')
          .from(MODULE.TENANT_CONFIG)
          .where('id', item.tenant_config)
          .first();

        newArr.push({
          ...item,
          user_counts: Number(backofficeUser[0].count),
          branch_counts: Number(tenantIds.length - 1),
          tenantConfig,
        });
      })
    );
  }
  return newArr;
};

const count = async () => knex(MODULE.TENANT).count('id').where('parent', null);

const search = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
    limit: param.size,
    offset: param.page * param.size,
  };
  const tenant = await knex.raw(
    `SELECT *
    FROM tenant 
    WHERE parent IS NULL and LOWER(name) LIKE LOWER(:search) ORDER BY created_date DESC LIMIT :limit offset :offset`,
    bindParam
  );
  const newArr = [];
  if (tenant.rows.length > 0) {
    await Promise.all(
      tenant.rows.map(async (item) => {
        const allTenants = await knex
          .select('id')
          .from('tenant')
          .where('id', item.id)
          .orWhere('parent', item.id);
        const tenantIds = allTenants.map((tenantItem) => tenantItem.id);
        const backofficeUser = await knex('backoffice_user')
          .count('id')
          .whereIn('tenant', tenantIds)
          .where({ user_type: 'User', is_active: true, is_deleted: false });
        const tenantConfig = await knex
          .select('*')
          .from(MODULE.TENANT_CONFIG)
          .where('id', item.tenant_config)
          .first();

        newArr.push({
          ...item,
          user_counts: Number(backofficeUser[0].count),
          branch_counts: Number(tenantIds.length - 1),
          tenantConfig,
        });
      })
    );
  }
  return newArr;
};

const countWithSearch = async (param) => {
  const bindParam = {
    search: `%${param.search}%`,
  };
  return knex.raw(
    `SELECT COALESCE(COUNT(id), 0) AS count FROM tenant WHERE parent IS NULL and LOWER(name) LIKE LOWER(:search)`,
    bindParam
  );
};

const findById = async (id) => {
  const column = [
    'tenant.*',
    knex.raw(
      `(SELECT row_to_json(tenant_config.*) AS tenant_config FROM tenant_config where tenant_config.id = tenant.tenant_config)`
    ),
    knex.raw(
      `(SELECT COALESCE(COUNT(t.id), 0) AS branch_counts from tenant as t where t.parent = tenant.id)`
    ),
    knex.raw(
      `(SELECT COALESCE(COUNT(bu.id), 0) AS user_counts from backoffice_user as bu where bu.tenant = tenant.id AND user_type = 'User' and is_deleted = false)`
    ),
  ];
  return knex.select(column).from(MODULE.TENANT).where('id', id);
};

const insert = async (tenantData, parole) => {
  const transaction = await knex.transaction();
  try {
    const user = await knex(MODULE.BACK_OFFICE_USER)
      .where('is_super_admin', true)
      .first();

    const theme = await knex(MODULE.THEME).where('key', DEFAULT).first();
    const tenantConfig = await transaction(MODULE.TENANT_CONFIG)
      .insert({
        name: tenantData.tenant_name,
        desc: `For ${tenantData.tenant_name} Description`,
        created_by: user.id,
        updated_by: user.id,
        gst_percentage: '10.0',
        shop_address: tenantData.address,
        theme: theme.id,
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
        trial_mode: tenantData.trial_mode,
        trial_start_date: tenantData.trial_start_date,
        trial_mode_limit: tenantData.trial_mode_limit,
        max_user_limit: tenantData.max_user_limit,
        max_branch_limit: tenantData.max_branch_limit,
        tenant_type: 'Shop',
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
        role: tenantData.role,
        user_type: 'ShopUser',
        password_type: 'New',
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

    const systemConfig = await transaction(MODULE.SYSTEM_CONFIG)
      .insert({
        domain: tenantData.domain,
        theme: JSON.stringify(tenantData.theme),
        tenant: tenant[0].id,
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
    logger.error(`Error:: ${error}
    Trace:: ${error.stack}`);
    return null;
  }
};

const update = async (body, tenantId) => {
  const transaction = await knex.transaction();
  try {
    const findUser = await transaction(MODULE.BACK_OFFICE_USER)
      .select('id')
      .where({ tenant: tenantId, user_type: BACK_OFFICE_USER_TYPE.SHOP_USER })
      .first();

    const userId = findUser.id;
    const findTenant = await transaction(MODULE.TENANT)
      .select('*')
      .where('id', tenantId)
      .first();

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
        max_user_limit: body.max_user_limit,
        max_branch_limit: body.max_branch_limit,
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

      const backofficeUpdateData = {
        role: body.role,
        first_name: body.first_name,
        last_name: body.last_name,
      };

      const backofficeUpdate = await transaction(MODULE.BACK_OFFICE_USER)
        .update(backofficeUpdateData)
        .where({
          tenant: tenantId,
          user_type: BACK_OFFICE_USER_TYPE.SHOP_USER,
        });

      if (!backofficeUpdate) {
        await transaction.rollback();
        const newError = new Error(`No User Update`);
        newError.detail = `User Data Not Provided.`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      }
      const updateModeData = {
        trial_mode: body.trial_mode,
        trial_mode_limit: body.trial_mode_limit,
      };

      if (body.trial_mode) {
        if (findTenant.trial_start_date) {
          const currentDate = moment().format('YYYY-MM-DD');
          const trialDate = moment(findTenant.trial_start_date).format(
            'YYYY-MM-DD'
          );
          if (currentDate < trialDate) {
            updateModeData.trial_start_date =
              moment().format('YYYY-MM-DD HH:mm');
          }
        } else {
          updateModeData.trial_start_date = moment().format('YYYY-MM-DD HH:mm');
        }
      } else {
        updateModeData.trial_start_date = null;
        updateModeData.trial_mode_limit = 0;
      }
      const tenant = await knex
        .select('id')
        .from(MODULE.TENANT)
        .where('id', tenantId)
        .orWhere('parent', tenantId);

      const tenantIds = tenant.map((item) => item.id);
      const updateMode = await transaction(MODULE.TENANT)
        .update(updateModeData)
        .whereIn('id', tenantIds);

      await Promise.all([updateMode]).catch(async (error) => {
        logger.error(
          `Error:: ${error}
          Trace:: ${error.stack}`
        );
        await transaction.rollback();
        const newError = new Error(`Tenant and user is not activated`);
        newError.detail = `tenant and users are not activated`;
        newError.code = HTTP_STATUS.BAD_REQUEST;
        throw newError;
      });

      const systemConfig = await transaction(MODULE.SYSTEM_CONFIG)
        .insert({
          tenant: tenantId,
          theme: JSON.stringify(body.theme),
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

      const branches = await knex
        .select('id')
        .from(MODULE.TENANT)
        .where('parent', tenantId);

      if (branches.length) {
        await Promise.all(
          branches.map(async (item) =>
            transaction(MODULE.SYSTEM_CONFIG)
              .update({
                theme: JSON.stringify(body.theme),
              })
              .where('tenant', item.id)
              .returning('*')
              .catch(async (error) => {
                await transaction.rollback();
                const newError = new Error(`No System Config Update ${error}`);
                newError.detail = `System config is not updated.`;
                newError.code = HTTP_STATUS.BAD_REQUEST;
                throw newError;
              })
          )
        );
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

const findByName = async (name) => {
  const column = [
    'tenant.*',
    knex.raw(
      `(SELECT row_to_json(tenant_config.*) AS tenant_config FROM tenant_config where tenant_config.id = tenant.tenant_config)`
    ),
    knex.raw(
      `(SELECT COALESCE(COUNT(t.id), 0) AS branch_counts from tenant as t where t.parent = tenant.id)`
    ),
    knex.raw(
      `(SELECT COALESCE(COUNT(bu.id), 0) AS user_counts from backoffice_user as bu where bu.tenant = tenant.id AND user_type = 'User')`
    ),
  ];
  return knex.select(column).from('tenant').where('name', name).first();
};

const findByTenantId = async (id) => {
  const column = [
    'tenant.*',
    knex.raw(
      `(SELECT COALESCE(COUNT(t.id), 0) AS branch_counts from tenant as t where t.parent = tenant.id)`
    ),
    knex.raw(
      `(SELECT COALESCE(COUNT(bu.id), 0) AS user_counts from backoffice_user as bu where bu.tenant = tenant.id AND user_type = 'User')`
    ),
  ];
  return knex.select(column).from('tenant').where('id', id).first();
};

const tenantDetail = async (id) =>
  knex.select('*').from(MODULE.TENANT).where('id', id).first();

const tenantDetailConfig = async (id) => {
  const columns = [
    't.id',
    't.tenant_config',
    knex.raw('json_agg(tc.*) -> 0 AS tenant_config'),
  ];
  return knex
    .select(columns)
    .from('tenant AS t')
    .leftJoin('tenant_config AS tc', 't.tenant_config', '=', 'tc.id')
    .where('t.id', id)
    .groupBy('t.id')
    .first();
};
const tenantDetailUser = async (tenantId) => {
  const columns = [
    'id',
    'username',
    'first_name',
    'last_name',
    'email',
    'avatar',
    'is_active',
    'created_date',
    'updated_date',
    'send_to_email',
  ];
  return knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where({ tenant: tenantId, user_type: BACK_OFFICE_USER_TYPE.SHOP_USER });
};

const tenantBranchDetailUser = async (id) => {
  const columns = [
    'id',
    'username',
    'first_name',
    'last_name',
    'email',
    'avatar',
    'is_active',
    'created_date',
    'updated_date',
    'send_to_email',
  ];
  return knex
    .select(columns)
    .from(MODULE.BACK_OFFICE_USER)
    .where({ tenant: id, user_type: BACK_OFFICE_USER_TYPE.BRANCH_USER });
};

const tenantDetailCategory = async (id) => {
  const columns = [
    'home_category.*',
    knex.raw(
      " CASE WHEN count(hci.*) = 0 THEN '[]'::json ELSE json_agg(hci.*) END AS home_cat_item"
    ),
  ];
  return knex
    .select(columns)
    .from(MODULE.HOME_CATEGORY)
    .leftJoin(
      'home_cat_item AS hci',
      'home_category.id',
      '=',
      'hci.home_category'
    )
    .where('home_category.tenant', id)
    .groupBy('home_category.id');
};

const ownerDetail = async (id) => {
  const tenant = await knex(MODULE.TENANT)
    .where('id', id)
    .orWhere('parent', id);
  const tenantIds = tenant.map((item) => item.id);
  const userCounts = await knex('backoffice_user')
    .count('id')
    .whereIn('tenant', tenantIds)
    .where('user_type', BACK_OFFICE_USER_TYPE.USER);

  const bindParams = {
    id,
  };
  const shop = await knex.raw(
    `
      SELECT
        t.*,
        COALESCE((
          SELECT COUNT(id)
          FROM backoffice_user
          WHERE parent = bu.id AND user_type = 'BranchUser'
        ), 0) AS branch_counts,
        COALESCE((
          SELECT COUNT(id)
          FROM backoffice_user
          WHERE parent = bu.id AND user_type = 'User'
        ), 0) AS user_counts,
        json_agg(tc.*) -> 0 AS tenant_config,
        json_agg(sc.*) -> 0 AS system_config
      FROM tenant AS t
      LEFT JOIN backoffice_user AS bu ON bu.tenant = t.id
      LEFT JOIN tenant_config AS tc ON tc.id = t.tenant_config
      LEFT JOIN system_config AS sc ON sc.tenant = t.id
      WHERE t.id = :id AND bu.user_type = 'ShopUser'
      GROUP BY t.id, bu.id;
    `,
    bindParams
  );

  let themeResult;
  if (shop.rows[0].system_config) {
    const themeQuery = await knex(MODULE.THEME).whereIn(
      'id',
      shop.rows[0].system_config.theme
    );
    themeResult = themeQuery;
  } else {
    const themeQuery = await knex(MODULE.THEME).where('key', DEFAULT);
    themeResult = themeQuery;
  }

  // const bindParams = {
  //   id: id
  // }

  // const shop = await knex.raw(`
  //   SELECT
  //   t.*,
  //   (SELECT COUNT(id) FROM backoffice_user WHERE parent = bu.id AND user_type = 'BranchUser') as branch_counts,
  //   (SELECT COUNT(id) FROM backoffice_user WHERE parent = bu.id AND user_type = 'User') as user_counts,
  //   (
  //       SELECT json_agg(subquery.*)
  //       FROM (
  //           SELECT t2.*, (SELECT COUNT(id) FROM backoffice_user WHERE parent = bu2.id AND user_type = 'User') as user_counts
  //           FROM tenant AS t2
  //           LEFT JOIN backoffice_user bu2 ON bu2.tenant = t2.id
  //           WHERE t2.parent = t.id AND bu2.user_type = 'BranchUser'
  //           GROUP BY
  //             t2.id, bu2.id
  //       ) AS subquery
  //   ) AS branches
  //   FROM
  //       tenant as t
  //   LEFT JOIN
  //       backoffice_user bu ON bu.tenant = t.id
  //   WHERE
  //       t.id = :id AND bu.user_type = 'ShopUser'
  //   GROUP BY
  //     t.id, bu.id;
  // `, bindParams);

  if (shop.rows.length && Object.keys(shop.rows[0]).length > 0) {
    const branches = await knex.raw(
      `
        SELECT 
          t.*,
          COALESCE((
            SELECT COUNT(id) 
            FROM backoffice_user 
            WHERE parent = bu.id AND user_type = 'User'
          ), 0) AS user_counts,
          json_agg(tc.*) -> 0 AS tenant_config
        FROM tenant AS t
        LEFT JOIN backoffice_user AS bu ON bu.tenant = t.id
        LEFT JOIN tenant_config AS tc ON tc.id = t.tenant_config
        WHERE t.parent = :id AND bu.user_type = 'BranchUser'
        GROUP BY t.id, bu.id;
      `,
      bindParams
    );

    let newResult;
    if (branches.rows.length > 0) {
      // remove keys from branches array of object
      newResult = branches.rows.map(
        ({
          created_by,
          updated_by,
          tenant_config,
          max_branch_limit,
          parent,
          ...rest
        }) => rest
      );
    } else {
      newResult = [];
    }

    const newData = {
      id: shop.rows[0].id,
      name: shop.rows[0].name,
      is_active: shop.rows[0].is_active,
      created_date: shop.rows[0].created_date,
      updated_date: shop.rows[0].updated_date,
      desc: shop.rows[0].desc,
      trial_mode: shop.rows[0].trial_mode,
      trial_start_date: shop.rows[0].trial_start_date,
      user_limit: shop.rows[0].user_limit,
      max_user_limit: shop.rows[0].max_user_limit,
      max_branch_limit: shop.rows[0].max_branch_limit,
      trial_mode_limit: shop.rows[0].trial_mode_limit,
      user_counts: Number(shop.rows[0].user_counts),
      branch_counts: Number(shop.rows[0].branch_counts),
      total_user_counts: Number(userCounts[0].count),
      tenant_config: shop.rows[0].tenant_config,
      theme: themeResult,
      branches: newResult,
    };
    return newData;
  }
  const newError = new Error(`No Tenant Found`);
  newError.detail = `Tenant id is not found.`;
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

const updateStatus = async (id, data) => {
  const transaction = await knex.transaction();
  try {
    const tenant = await knex(MODULE.TENANT)
      .where('id', id)
      .orWhere('parent', id);
    const tenantIds = [];
    const tenantQueries = tenant.map((item) => {
      tenantIds.push(item.id);
      const newData = {
        is_active: data.is_active,
      };
      if (item.trial_start_date) {
        newData.trial_mode = data.is_active;
        if (data.is_active) {
          newData.trial_start_date = moment().format('YYYY-MM-DD HH:mm:ss');
        }
      }
      return knex(MODULE.TENANT).update(newData).where('id', item.id);
    });

    const backofficeUserQuery = knex(MODULE.BACK_OFFICE_USER)
      .update({ is_active: data.is_active, is_deleted: !data.is_active })
      .whereIn('tenant', tenantIds);

    let appUserQuery = null;
    const appUsers = await knex('app_user').whereIn('tenant', tenantIds);
    if (appUsers && appUsers.length > 0) {
      appUserQuery = knex('app_user')
        .update({ is_active: data.is_active, is_deleted: !data.is_active })
        .whereIn('tenant', tenantIds);
    }

    const updateResult = await Promise.all([
      ...tenantQueries,
      backofficeUserQuery,
      appUserQuery,
    ]).catch(async (error) => {
      logger.error(error);
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

const findByTenantConfigById = (id) =>
  knex.select('*').from(MODULE.TENANT_CONFIG).where('id', id);

const findByTenantConfigByName = (name) =>
  knex.select('*').from(MODULE.TENANT_CONFIG).where('name', name).first();

const findUserById = async (id) => {
  const column = [
    'id',
    'username',
    'is_active',
    'is_deleted',
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

const editTenant = async (id) => {
  const columns = [
    't.*',
    knex.raw('json_agg(tc.*) -> 0 AS tenant_config'),
    knex.raw('json_agg(u.*) -> 0 AS backoffice_user'),
    knex.raw('json_agg(sc.*) -> 0 AS system_config'),
  ];
  const tenant = await knex
    .select(columns)
    .from('tenant AS t')
    .leftJoin('tenant_config AS tc', 't.tenant_config', '=', 'tc.id')
    .leftJoin('backoffice_user AS u', 't.id', '=', 'u.tenant')
    .leftJoin('system_config AS sc', 'sc.tenant', '=', 't.id')
    .where('t.id', id)
    .groupBy('t.id')
    .first();

  const theme = await knex(MODULE.THEME).whereIn(
    'id',
    tenant.system_config.theme
  );
  tenant.theme = theme;
  return tenant;
};

const checkBranchLimit = async (tenantId) => {
  const tenantResult = await findByTenant(tenantId);
  const bindParams = {
    tenantId,
  };
  const tenant = await knex.raw(
    `
    SELECT COALESCE(COUNT(id), 0) as branch_counts
    FROM tenant
    WHERE parent = :tenantId
  `,
    bindParams
  );

  if (
    tenant.rows.length &&
    Number(tenant.rows[0].branch_counts) >= Number(tenantResult.branch_limit)
  ) {
    return false;
  }
  return true;
};

const findSystemConfigByTenant = async (tenant) => {
  const systemConfig = await knex
    .select(['sc.*', knex.raw(`json_agg(tenant.*) -> 0 AS tenant`)])
    .from('system_config as sc')
    .leftJoin('tenant', 'tenant.id', 'sc.tenant')
    .where('sc.tenant', tenant)
    .groupBy('sc.id')
    .first();

  const theme = await knex(MODULE.THEME).whereIn('id', systemConfig.theme);
  systemConfig.theme = theme;

  return systemConfig;
};

module.exports = {
  findById,
  insert,
  findByName,
  count,
  tenantList,
  search,
  countWithSearch,
  tenantDetail,
  tenantDetailConfig,
  tenantDetailUser,
  tenantDetailCategory,
  findByTenantId,
  update,
  findByTenantConfigById,
  updateStatus,
  findByTenantConfigByName,
  findUserById,
  updateUserById,
  ownerDetail,
  editTenant,
  checkBranchLimit,
  tenantBranchDetailUser,
  findSystemConfigByTenant,
};
