const knex = require('../../../config/databaseConnection');
const { RATING_STATUS } = require('../../../utils/constants/enumConstants');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (data) => {
  // console.log('data:::::::', data);
  const query = knex
    .from(MODULE.APP.RATING)
    .leftJoin('home_cat_item as hci', 'hci.id', 'rating.home_cat_item')
    .where({
      tenant: data.tenant,
      'rating.is_deleted': false,
      status: RATING_STATUS.COMPLETED,
    })
    .andWhere((queryBuilder) => {
      if (data.search) {
        queryBuilder.whereRaw('LOWER(hci.name) LIKE LOWER(?)', [
          `%${data.search}%`,
        ]);
      }
    });

  const queryList = query
    .clone()
    .distinct('rating.home_cat_item')
    .select(
      'hci.*',
      knex.raw(`sum(rating.star) as star`),
      knex.raw(`count(rating.id) as reviews`)
    )
    .groupBy('rating.home_cat_item', 'hci.id')
    .orderBy('rating.home_cat_item', 'desc')
    .offset(data.page * data.size)
    .limit(data.size);

  const multiQuery = [
    query
      .clone()
      .select(
        knex.raw(`sum(count(distinct rating.home_cat_item)) over() as count`)
      ),
    queryList,
  ].join(';');

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

module.exports = {
  list,
};
