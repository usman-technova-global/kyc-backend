const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (data) => {
  const columns = ['id', 'question', 'answer', 'is_active'];

  const faqQuery = knex
    .from(MODULE.APP.FAQS)
    .whereRaw('tenant = ?', [data.tenant])
    .andWhere((queryBuilder) => {
      if (data.search) {
        queryBuilder
          .orWhereRaw('LOWER(app_faqs.question) LIKE LOWER(?)', [
            `%${data.search}%`,
          ])
          .orWhereRaw('LOWER(app_faqs.answer) LIKE LOWER(?)', [
            `%${data.search}%`,
          ]);
      }
    });

  const totalFaqQuery = faqQuery.clone().count();

  const faqQueryFiltered = faqQuery
    .clone()
    .select(columns)
    .limit(data.size)
    .offset(data.page * data.size);

  const multiQuery = [totalFaqQuery, faqQueryFiltered].join(';');

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

const create = async (data) =>
  knex(MODULE.APP.FAQS).insert(data).returning('*');

const update = async (data, id) =>
  knex(MODULE.APP.FAQS).where('id', id).update(data).returning('*');

const find = async (id) => knex(MODULE.APP.FAQS).where('id', id).first();

module.exports = {
  list,
  create,
  update,
  find,
};
