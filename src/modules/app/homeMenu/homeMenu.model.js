const knex = require('../../../config/databaseConnection');

const IS_ACTIVE = true;
const IS_DELETED = false;

const listByTenantId = async (id) =>
  knex
    .from('home_category')
    .where({
      'home_category.tenant': id,
      is_active: IS_ACTIVE,
      is_deleted: IS_DELETED,
    })
    .select(['home_category.*']);

const viewByTenantIdAndMenuId = async (param) =>
  knex
    .from('home_category')
    .select([
      'home_category.*',
      knex.raw(
        '(SELECT json_agg(hci.*) AS json_agg FROM home_cat_item AS hci WHERE home_category.id = hci.home_category and is_active = true and is_deleted = false) as home_cat_items'
      ),
    ])
    .where('home_category.id', param.menuId);

const viewSubmenuByTenantIdAndMenuId = async (param) =>
  knex
    .from('home_cat_item')
    .select([
      'home_cat_item.*',
      knex.raw(
        '(SELECT json_agg(hcif.*) AS json_agg FROM home_cat_item_faq AS hcif WHERE home_cat_item.id = hcif.home_category_item and is_active = true and is_deleted = false) as home_cat_item_faq'
      ),
    ])
    .where('home_cat_item.id', param.submenuId);

const detailHomeCatItem = async (itemId) =>
  knex
    .from('home_cat_item')
    .select([
      'home_cat_item.*',
      knex.raw(`(
        SELECT 
          CASE 
            WHEN COUNT(hcif.id) > 0 
            THEN json_agg(hcif.*) 
            ELSE '[]'::json 
          END AS home_cat_item_faq
        FROM home_cat_item_faq AS hcif 
        WHERE hcif.home_category_item  = home_cat_item.id 
        AND hcif.is_active = true 
        AND hcif.is_deleted = false
        )`),
    ])
    .where('home_cat_item.id', itemId);

module.exports = {
  listByTenantId,
  viewByTenantIdAndMenuId,
  viewSubmenuByTenantIdAndMenuId,
  detailHomeCatItem,
};
