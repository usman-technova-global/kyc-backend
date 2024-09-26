const knex = require('../src/config/databaseConnection');
const { APP_CART_STATUS } = require('../src/utils/constants/enumConstants');

const abandonedCart = async () => {
  const cartResult = await knex('app_user_cart').where(
    'status',
    APP_CART_STATUS.NEW
  );
  const queryPromise = cartResult.map(async (item) => {
    const orderResult = await knex('app_order')
      .where('app_user_cart', item.id)
      .first();
    if (!orderResult) {
      return knex('app_user_cart')
        .update({ status: APP_CART_STATUS.ABANDONED })
        .where('id', item.id);
    }
    return null;
  });

  await Promise.all(queryPromise);
};

module.exports = {
  abandonedCart,
};
