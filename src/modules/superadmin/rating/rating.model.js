const knex = require('../../../config/databaseConnection');
const { jsonBuildObject } = require('../../../utils/commonUtil');
const { RATING_STATUS } = require('../../../utils/constants/enumConstants');
const MODULE = require('../../../utils/constants/moduleNames');

const update = (id, data) =>
  knex(MODULE.APP.RATING).update(data).where('id', id);

const reviews = async (data) => {
  const query = knex(MODULE.APP.RATING).where({
    home_cat_item: data.homeCatItem,
    'rating.is_deleted': false,
    'rating.status': RATING_STATUS.COMPLETED,
  });

  const queryList = query
    .clone()
    .select(
      'rating.*',
      knex.raw(
        jsonBuildObject('app_user', [
          'id',
          'email',
          'first_name',
          'last_name',
          'avatar',
        ])
      )
    )
    .leftJoin('app_user', 'app_user.id', 'rating.app_user')
    .where('rating.is_deleted', false)
    .groupBy('rating.id')
    .orderBy('rating.created_date', 'desc')
    .offset(data.page * data.size)
    .limit(data.size);

  const multiQuery = [query.clone().count(), queryList].join(';');

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

const getDistinctStars = async (data) => {
  const stars = [
    { star: 0, total: 0 },
    { star: 1, total: 0 },
    { star: 2, total: 0 },
    { star: 3, total: 0 },
    { star: 4, total: 0 },
    { star: 5, total: 0 },
  ];
  const query = knex(MODULE.APP.RATING).where({
    home_cat_item: data.homeCatItem,
    'rating.is_deleted': false,
    'rating.status': RATING_STATUS.COMPLETED,
  });

  const sumStars = query.clone().sum('star');

  const starQuery = query
    .clone()
    .distinct('rating.star')
    .select(knex.raw(`sum(rating.star) as total`))
    .groupBy('rating.star');

  const multiQuery = [sumStars, starQuery].join(';');

  const [{ rows: totalStars }, { rows: starList }] = await knex.raw(multiQuery);

  return {
    totalStars: totalStars[0].sum,
    starList: stars.map((item) => {
      const foundItem = starList.find((item2) => item2.star === item.star);
      if (foundItem) {
        return { star: foundItem.star, total: parseInt(foundItem.total, 10) };
      }
      return item;
    }),
  };
};

module.exports = {
  update,
  reviews,
  getDistinctStars,
};
