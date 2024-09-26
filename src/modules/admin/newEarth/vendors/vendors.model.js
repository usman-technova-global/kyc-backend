const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

// Fetch vendors with optional search and pagination
const get = async (param) => {
  const query = knex
    .from(`${MODULE.NEW_EARTH.VENDORS} as v`)
    .whereRaw('v.tenant = ?', [param.tenant])
    .whereRaw('v.deleted_at is ?', [null])
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.whereRaw('v.name ILIKE ?', [`%${param.search}%`]);
      }
    });

  const filteredQuery = query
    .clone()
    .select('v.*')
    .limit(param.size)
    .offset(param.page * param.size);

  const multiQuery = [query.clone().count(), filteredQuery].join(';');

  const [
    {
      rows: [total],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    list: totalList,
    total: total.count,
  };
};

// Fetch vendors with optional search and pagination
const getLov = async (param) => {
  const results = await knex
    .from(`${MODULE.NEW_EARTH.VENDORS} as v`)
    .whereRaw('v.tenant = ?', [param.tenant])
    .where('v.deleted_at ', null)
    .select(['v.id', 'v.name']);

  return results;
};

// Get a single vendor by ID
const getById = async (vendorId) => {
  const result = await knex
    .from(`${MODULE.NEW_EARTH.VENDORS}`)
    .where({ id: vendorId, deleted_at: null })
    .first();

  return result;
};

// Create a new vendor
const create = async (vendorData) => {
  const data = {};
  data.name = vendorData.name;
  data.email = vendorData.email;
  data.vendor_type = vendorData.vendorType;
  data.service_type = vendorData.serviceType;
  data.contact = vendorData.contact;
  data.tenant = vendorData.tenant;
  data.bank_name = vendorData.bankName;
  data.iban = vendorData.iban;
  data.location = vendorData.location;
  data.city = vendorData.city;
  data.country = vendorData.country;
  data.delivery_time = vendorData.deliveryTime;
  data.delivery_terms = vendorData.deliveryTerms;
  data.payment_terms = vendorData.paymentTerms;
  data.created_by = vendorData.userId;
  data.created_at = knex.fn.now();
  data.updated_at = knex.fn.now();
  const [newVendor] = await knex(`${MODULE.NEW_EARTH.VENDORS}`)
    .insert([data])
    .returning('*');

  return newVendor;
};

// Update an existing vendor by ID
const update = async (vendorId, vendorData) => {
  const data = {};
  if (vendorData.name) data.name = vendorData.name;
  if (vendorData.email) data.email = vendorData.email;
  if (vendorData.vendorType) data.vendor_type = vendorData.vendorType;
  if (vendorData.serviceType) data.service_type = vendorData.serviceType;
  if (vendorData.contact) data.contact = vendorData.contact;
  if (vendorData.tenant) data.tenant = vendorData.tenant;
  if (vendorData.bankName) data.bank_name = vendorData.bankName;
  if (vendorData.iban) data.iban = vendorData.iban;
  if (vendorData.location) data.location = vendorData.location;
  if (vendorData.city) data.city = vendorData.city;
  if (vendorData.country) data.country = vendorData.country;
  if (vendorData.deliveryTime) data.delivery_time = vendorData.deliveryTime;
  if (vendorData.deliveryTerms) data.delivery_terms = vendorData.deliveryTerms;
  if (vendorData.paymentTerms) data.payment_terms = vendorData.paymentTerms;
  data.updated_by = vendorData.userId;
  data.updated_at = knex.fn.now();
  const [updatedVendor] = await knex(`${MODULE.NEW_EARTH.VENDORS}`)
    .where({ id: vendorId })
    .update(data)
    .returning('*');

  return updatedVendor;
};

// Soft delete a vendor by ID
const remove = async (vendorId) => {
  await knex(`${MODULE.NEW_EARTH.VENDORS}`)
    .where({ id: vendorId })
    .update({ deleted_at: knex.fn.now() });

  return { success: true };
};

module.exports = {
  get,
  getById,
  getLov,
  create,
  update,
  remove,
};
