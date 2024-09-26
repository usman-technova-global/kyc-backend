const { v4: uuidv4 } = require('uuid');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const adminVoucher = require('../../voucher/voucher.model');
const {
  VOUCHER_DISCOUNT_TYPE,
  ORDER_PAYMENT_TYPE,
  APP_CART_STATUS,
  APP_ORDER_STATUS,
  APP_ORDER_PAYMENT_STATUS,
} = require('../../../../utils/constants/enumConstants');

const IS_DELETED = false;

const insertCartItems = async (transaction, cartId, products) => {
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
};

const getHomeCategoryItem = async (itemId) =>
  knex(MODULE.HOME_CATEGORY_ITEM)
    .select('*')
    .where({ id: itemId, is_active: true })
    .first();

const getCartByUser = async (userData) => {
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
};

const categoryList = async (param) =>
  knex
    .select('*')
    .from(MODULE.HOME_CATEGORY)
    .where('tenant', param.tenant)
    .andWhere({ is_active: true, is_deleted: IS_DELETED })
    .orderBy('created_date', 'desc');

const catItemList = async (param) =>
  knex
    .select('*')
    .from(MODULE.HOME_CATEGORY_ITEM)
    .where('home_category', param.categoryId)
    .andWhere({ is_active: true, is_deleted: IS_DELETED })
    .orderBy('created_date', 'desc');

const updateCart = async (cartObject) => {
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
        (tempCart) => tempCart.id !== cartObject.cart_id
      );

      const oldCartsUpdatePromise = oldCarts.map(async (tempCart) => {
        await transaction(MODULE.APP.USER_CART)
          .where('id', tempCart.id)
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
      let totalAmount = products.reduce(
        (previousValue, currentValue) =>
          previousValue + currentValue.unit_price * currentValue.quantity,
        0
      );
      let discountAmount = 0;
      if (cartObject.voucher_code) {
        const adminVoucherResult = await transaction(MODULE.ADMIN.VOUCHER)
          .where({
            tenant: cartObject.tenant,
            voucher_code: cartObject.voucher_code,
          })
          .first();

        if (totalAmount > Number(adminVoucherResult.min_amount)) {
          if (
            adminVoucherResult.discount_type === VOUCHER_DISCOUNT_TYPE.AMOUNT
          ) {
            discountAmount = adminVoucherResult.value;
          } else {
            discountAmount = totalAmount * (adminVoucherResult.value / 100);
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
};

const newOrder = async (orderObject) => {
  const transaction = await knex.transaction();

  try {
    const tenant = await knex(MODULE.TENANT)
      .where('id', orderObject.tenant)
      .first();
    const cart = await transaction(MODULE.APP.USER_CART)
      .select('*')
      .where({
        app_user: orderObject.app_user,
        tenant: orderObject.tenant,
        id: orderObject.cart_id,
        status: APP_CART_STATUS.NEW,
      })
      .first();

    if (!cart) {
      await transaction.rollback();
      const noCartError = new Error(`No Cart With Status 'New'`);
      noCartError.detail = `Cart With 'New' Status Does Not Exist`;
      noCartError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartError;
    }
    if (!cart.pickup_date_time) {
      await transaction.rollback();
      const noCartPickupDateError = new Error(`No Cart Pickup Order Date`);
      noCartPickupDateError.detail = `Cart Pickup Order Date Is Not Set`;
      noCartPickupDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartPickupDateError;
    }
    if (!cart.drop_date_time) {
      await transaction.rollback();
      const noCartDropDateError = new Error(`No Cart Drop Package Date`);
      noCartDropDateError.detail = `Cart Drop Package Date Is Not Set`;
      noCartDropDateError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartDropDateError;
    }

    if (!cart.app_user_address) {
      await transaction.rollback();
      const noCartUserAddressError = new Error(`No Cart User Address`);
      noCartUserAddressError.detail = `User Address Is Not Provided`;
      noCartUserAddressError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartUserAddressError;
    }

    const cartItems = await transaction(MODULE.APP.USER_CART_ITEM)
      .select('*')
      .where({ cart_id: cart.id });

    if (cartItems.length <= 0) {
      await transaction.rollback();
      const noCartItemsError = new Error(`No Items In Cart`);
      noCartItemsError.detail = `No Products In Cart`;
      noCartItemsError.code = HTTP_STATUS.BAD_REQUEST;
      throw noCartItemsError;
    }

    const orderData = {
      status: APP_ORDER_STATUS.PROCESSING_ITEM,
      payment_status: APP_ORDER_PAYMENT_STATUS.PAID,
      payment_type: ORDER_PAYMENT_TYPE.SHOP,
      app_user: cart.app_user,
      tenant: cart.tenant,
      pickup_date_time: cart.pickup_date_time,
      drop_date_time: cart.drop_date_time,
      app_user_address: cart.app_user_address,
      voucher_code: cart.voucher_code,
      gst_percentage: cart.gst_percentage,
      discount: cart.discount,
      gst_amount: cart.gst_amount,
      total_amount: cart.total_amount,
      grand_total: cart.grand_total,
      app_user_cart: cart.id,
      fulfillment_method: orderObject.fulfillment_method,
    };

    const [order] = await transaction(MODULE.APP.ORDER)
      .insert(orderData)
      .returning('*');

    const orderItemsData = cartItems.map((item) => ({
      quantity: item.quantity,
      unit_price: item.unit_price,
      app_order: order.id,
      item_id: item.item_id,
    }));

    const orderItems = await transaction(MODULE.APP.ORDER_ITEM)
      .insert(orderItemsData)
      .returning('*');

    const updatedCart = {
      status: APP_CART_STATUS.COMPLETED,
    };
    await transaction(MODULE.APP.USER_CART)
      .where('id', cart.id)
      .update(updatedCart);

    const orderStatus = {
      app_user: orderObject.app_user,
      app_order: order.id,
      status: APP_ORDER_STATUS.PROCESSING_ITEM,
    };

    await transaction(MODULE.APP.ORDER_STATUSES).insert(orderStatus);
    // console.log('order::::::', order);
    if (cart.voucher_code) {
      let promotionList = await adminVoucher.promotion({
        tenant: order.tenant,
        app_user: order.app_user,
      });
      if (promotionList.length === 0) {
        await transaction.rollback();
        const noCartItemsError = new Error(`No Promotion List Found`);
        noCartItemsError.detail = `No promotion list found`;
        noCartItemsError.code = HTTP_STATUS.BAD_REQUEST;
        throw noCartItemsError;
      }
      promotionList = promotionList.filter(
        (item) => item.voucher_code === cart.voucher_code
      );
      if (promotionList.length > 0) {
        await transaction(MODULE.ADMIN.VOUCHER_HISTORY).insert({
          admin_voucher: promotionList[0].id,
          app_user: order.app_user,
          app_order: order.id,
          tenant: order.tenant,
        });
        if (!promotionList[0].is_unlimited_redeem) {
          if (promotionList[0].redeem_count <= promotionList[0].max_redeem) {
            await transaction(MODULE.ADMIN.VOUCHER)
              .update({
                redeem_count: promotionList[0].redeem_count + 1,
              })
              .where('id', promotionList[0].id);
          }
        }
      }
    }

    const tenantConfig = await transaction(MODULE.TENANT_CONFIG)
      .where('id', tenant.tenant_config)
      .first();

    if (tenantConfig && tenantConfig.enable_loyalty_program) {
      const orderItemIds = orderItems.map((item) => item.item_id);
      const totalCoins = await transaction(MODULE.HOME_CATEGORY_ITEM)
        .sum('loyalty_coins')
        .whereIn('id', orderItemIds);

      await transaction(MODULE.ADMIN.LOYALTY_HISTORY)
        .insert({
          app_user: order.app_user,
          app_order: order.id,
          tenant: order.tenant,
          coins: Number(totalCoins[0].sum),
        })
        .returning();

      await transaction(MODULE.APP.USER)
        .update({ loyalty_coins: Number(totalCoins[0].sum) })
        .where('id', orderObject.app_user);
    }

    await transaction.commit();
    return {
      order,
      orderItems,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getCartByUser,
  categoryList,
  catItemList,
  updateCart,
  newOrder,
};
