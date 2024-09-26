/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const knex = require('../../../config/databaseConnection');
const MODULE = require('../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const {
  VOUCHER_DISCOUNT_TYPE,
  APP_CART_STATUS,
} = require('../../../utils/constants/enumConstants');

async function getHomeCategoryItem(itemId) {
  return knex(MODULE.HOME_CATEGORY_ITEM)
    .select('*')
    .where({ id: itemId, is_active: true })
    .first();
}

async function insertCartItems(transaction, cartId, products) {
  await transaction(MODULE.APP.USER_CART_ITEM).where({ cart_id: cartId }).del();
  const cartItemsPromise = await products.map(async (product) => {
    const p = await transaction(MODULE.HOME_CATEGORY_ITEM)
      .select({ id: 'id', price: 'price' })
      .where({ id: product.id })
      .first();
    return {
      item_id: p.id,
      cart_id: cartId,
      quantity: product.quantity,
      unit_price: p.price,
    };
  });
  const cartItems = await Promise.all(cartItemsPromise);
  return transaction(MODULE.APP.USER_CART_ITEM)
    .insert(cartItems)
    .returning('*');
}

async function updateCart(cartObject) {
  // console.log('cartObject::::::', cartObject);
  const transaction = await knex.transaction();
  try {
    const cart = await transaction(MODULE.APP.USER_CART)
      .select('*')
      .where({
        tenant: cartObject.tenant,
        id: cartObject.cart_id,
        status: APP_CART_STATUS.NEW,
      })
      .first();

    if (cartObject.app_user) {
      const carts = await transaction(MODULE.APP.USER_CART).select('*').where({
        tenant: cartObject.tenant,
        app_user: cartObject.app_user,
        status: APP_CART_STATUS.NEW,
      });

      const oldCarts = carts.filter(
        (temp_cart) => temp_cart.id !== cartObject.cart_id
      );

      const oldCartsUpdatePromise = oldCarts.map(async (temp_cart) => {
        await transaction(MODULE.APP.USER_CART)
          .where('id', temp_cart.id)
          .update({ status: APP_CART_STATUS.ABANDONED });
      });

      await Promise.all(oldCartsUpdatePromise);
    }
    if (!cart) {
      await transaction.rollback();
      const noCartError = new Error(`Cart Does Not Exist Or In 'Processing'`);
      noCartError.detail = `Cart Does Not Exist Or Its Status Is Set To 'Processing'`;
      noCartError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartError;
    }
    await transaction(MODULE.APP.USER_CART_ITEM)
      .where('cart_id', cart.id)
      .del();
    if (cartObject.products.length > 0) {
      const products = await insertCartItems(
        transaction,
        cart.id,
        cartObject.products
      );
      // console.log('products::::::', products);
      let totalAmount = products.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.unit_price * currentValue.quantity,
        0
      );
      let discountAmount = 0;
      if (cartObject.voucher_code) {
        const adminVoucher = await transaction(MODULE.ADMIN.VOUCHER)
          .where({
            tenant: cartObject.tenant,
            voucher_code: cartObject.voucher_code,
          })
          .first();

        if (totalAmount > Number(adminVoucher.min_amount)) {
          if (adminVoucher.discount_type === VOUCHER_DISCOUNT_TYPE.AMOUNT) {
            discountAmount = adminVoucher.value;
          } else {
            discountAmount = totalAmount * (adminVoucher.value / 100);
          }
        }
      }
      totalAmount -= discountAmount;
      const gstPercentage = cart.gst_percentage;
      const gstAmount = totalAmount * (gstPercentage / 100);
      const grandTotal = gstAmount + totalAmount;
      const updatedCartData = {
        grand_total: grandTotal,
        total_amount: totalAmount,
        gst_percentage: gstPercentage,
        gst_amount: gstAmount,
        discount: discountAmount,
        app_user: cartObject.app_user || cart.app_user,
        app_user_device: cartObject.app_user_device || cart.app_user_device,
        app_user_address: cartObject.app_user_address || cart.app_user_address,
        pickup_date_time: cartObject.pickup_date_time || cart.pickup_date_time,
        drop_date_time: cartObject.drop_date_time || cart.drop_date_time,
        voucher_code: cartObject.voucher_code || cart.voucher_code,
      };
      const [updatedCart] = await transaction(MODULE.APP.USER_CART)
        .where('id', cart.id)
        .update(updatedCartData)
        .returning('*');

      await transaction.commit();

      return {
        cart: updatedCart,
      };
    }
    const gstPercentage = cart.gst_percentage;
    const updatedCartData = {
      grand_total: 0,
      total_amount: 0,
      gst_percentage: gstPercentage,
      gst_amount: 0,
      discount: 0,
      app_user: cartObject.app_user || cart.app_user,
      app_user_device: cartObject.app_user_device || cart.app_user_device,
      app_user_address: cartObject.app_user_address || cart.app_user_address,
      pickup_date_time: cartObject.pickup_date_time || cart.pickup_date_time,
      drop_date_time: cartObject.drop_date_time || cart.drop_date_time,
      voucher_code: cartObject.voucher_code || cart.voucher_code,
    };
    const [updatedCart] = await transaction(MODULE.APP.USER_CART)
      .where('id', cart.id)
      .update(updatedCartData)
      .returning('*');

    await transaction.commit();

    return {
      cart: updatedCart,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getCartByUser(userData) {
  const oldCart = await knex(MODULE.APP.USER_CART)
    .select('*')
    .where({
      app_user: userData.app_user,
      tenant: userData.tenant,
      status: APP_CART_STATUS.NEW,
    })
    .first();

  if (oldCart) {
    const cartItems = await knex(MODULE.APP.USER_CART_ITEM)
      .select('*')
      .where({ cart_id: oldCart.id });

    const populatedCartItemsPromise = cartItems.map(async (item) => {
      const homeCategoryItem = await getHomeCategoryItem(item.item_id);
      return {
        ...homeCategoryItem,
        buyCount: item.quantity,
      };
    });

    const populatedCartItems = await Promise.all(populatedCartItemsPromise);

    return { cart: oldCart, cartItems: populatedCartItems };
  }

  const tenant = await knex(MODULE.TENANT)
    .select('tenant_config')
    .where({ id: userData.tenant })
    .first();

  const tenantGSTPercentage = await knex(MODULE.TENANT_CONFIG)
    .select('gst_percentage')
    .where({ id: tenant.tenant_config })
    .first();

  const cartData = {
    id: uuidv4(),
    app_user: userData.app_user,
    tenant: userData.tenant,
    gst_percentage: tenantGSTPercentage.gst_percentage,
  };

  const [newCart] = await knex(MODULE.APP.USER_CART)
    .insert(cartData)
    .returning('*');
  return { cart: newCart, cartItems: [] };
}
// const productData = await knex("products").select("*").whereIn("id", productIds);
async function getCartByDevice(deviceData) {
  const oldCart = await knex(MODULE.APP.USER_CART)
    .select('*')
    .where({
      app_user_device: deviceData.app_user_device,
      tenant: deviceData.tenant,
      status: APP_CART_STATUS.NEW,
    })
    .first();
  if (oldCart) {
    const cartItems = await knex(MODULE.APP.USER_CART_ITEM)
      .select('*')
      .where({ cart_id: oldCart.id });

    const populatedCartItemsPromise = cartItems.map(async (item) => {
      const homeCategoryItem = await getHomeCategoryItem(item.item_id);
      return {
        ...homeCategoryItem,
        buyCount: item.quantity,
      };
    });

    const populatedCartItems = await Promise.all(populatedCartItemsPromise);

    return { cart: oldCart, cartItems: populatedCartItems };
  }
  const tenant = await knex(MODULE.TENANT)
    .select('tenant_config')
    .where({ id: deviceData.tenant })
    .first();
  const tenantGSTPercentage = await knex(MODULE.TENANT_CONFIG)
    .select('gst_percentage')
    .where({ id: tenant.tenant_config })
    .first();
  const cartData = {
    id: uuidv4(),
    app_user_device: deviceData.app_user_device,
    tenant: deviceData.tenant,
    gst_percentage: tenantGSTPercentage.gst_percentage,
  };

  const [newCart] = await knex(MODULE.APP.USER_CART)
    .insert(cartData)
    .returning('*');
  return { cart: newCart, cartItems: [] };
}

module.exports = {
  updateCart,
  getCartByUser,
  getCartByDevice,
};
