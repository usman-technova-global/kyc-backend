const knex = require('../../../config/databaseConnection');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (tenant) => {
  const columns = [
    'id',
    'name',
    'banner',
    'link',
    'short_desc',
    'page_detail',
    'banner_type',
    'is_active',
    'is_deleted',
    'created_date',
  ];
  return knex
    .select(columns)
    .from(MODULE.BANNER)
    .where({ tenant, is_deleted: false })
    .orderBy('created_date', 'desc');
};

const findById = async (id) => {
  const columns = [
    'id',
    'name',
    'banner',
    'link',
    'short_desc',
    'page_detail',
    'banner_type',
    'is_active',
    'is_deleted',
    'created_date',
  ];

  return knex.select(columns).from(MODULE.BANNER).where('id', id).first();
};
const createMultipart = async (data) => {
  const banner = await knex(MODULE.BANNER).where({
    tenant: data.tenant,
    is_deleted: false,
  });
  if (banner && banner.length >= 15) {
    const newError = new Error(`No Banner Create`);
    newError.detail = `banner has exceeded a limit of 15 banners`;
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }
  return knex(MODULE.BANNER).insert(data);
};

const update = async (data, bannerId) =>
  knex(MODULE.BANNER).update(data).where('id', bannerId);

module.exports = {
  list,
  createMultipart,
  findById,
  update,
};
