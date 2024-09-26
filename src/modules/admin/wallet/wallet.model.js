const knex = require('../../../config/databaseConnection');
const {
  WALLET_STATUS,
  TRANSACTION_TYPE,
  REFERENCE_TYPE,
} = require('../../../utils/constants/enumConstants');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const MODULE = require('../../../utils/constants/moduleNames');

const list = async (param) => {
  // console.log('data:::::::', data);
  const query = knex
    .leftJoin(`${MODULE.APP.USER}`, 'app_user.id', 'wallets.app_user')
    .where({
      'wallets.tenant': param.tenant,
    })
    .andWhere((queryBuilder) => {
      if (param.search) {
        queryBuilder.orWhereRaw('app_user.first_name ILIKE ?', [
          `%${param.search}%`,
        ]);
        queryBuilder.orWhereRaw('app_user.last_name ILIKE ?', [
          `%${param.search}%`,
        ]);
        queryBuilder.orWhereRaw('app_user.email ILIKE ?', [
          `%${param.search}%`,
        ]);
        queryBuilder.orWhereRaw('app_user.phone ILIKE ?', [
          `%${param.search}%`,
        ]);
      }
    })
    .from(MODULE.WALLETS);

  const queryList = query
    .clone()
    .select(['wallets.*', knex.raw(`json_agg(app_user.*) -> 0 as app_user`)])
    .groupBy('wallets.id')
    .orderBy('wallets.created_date', 'desc')
    .offset(param.page * param.size)
    .limit(param.size);

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

const create = async (param, data) => {
  const transaction = await knex.transaction();
  try {
    // console.log('PARAM', param);
    // console.log('DATA', data);

    const appointment = await transaction(MODULE.STORE.APPOINTMENT)
      .where('id', data.reference_id)
      .first();

    if (!appointment) {
      await transaction.rollback();
      const newError = new Error(`No appointment found`);
      newError.detail = `No appointment found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const appUser = await transaction(MODULE.APP.USER)
      .where('id', appointment.app_user)
      .first();

    if (!appUser || appUser.user_type !== 'App') {
      await transaction.rollback();
      const newError = new Error(`No customer found`);
      newError.detail = `No customer found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const findWallet = await transaction(MODULE.WALLETS)
      .where('app_user', appUser.id)
      .first();

    if (Number(data.balance) <= 0) {
      const newError = new Error(`Balance is invalid`);
      newError.detail = `Balance is invalid`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const walletData = {
      app_user: appointment.app_user,
      balance: data.balance,
      reference_type: REFERENCE_TYPE.APPOINTMENT,
      tenant: param.tenant,
      status: WALLET_STATUS.BALANCE,
    };

    let walletsQUery = [];
    if (findWallet) {
      const userBalance = parseInt(findWallet.balance ?? 0, 10);
      const newBalance = parseInt(data.balance, 10);
      const totalBalance = userBalance + newBalance;
      walletsQUery = await transaction(MODULE.WALLETS)
        .update({
          balance: totalBalance,
          updated_date: new Date(),
        })
        .returning('*');
    } else {
      walletsQUery = await transaction(MODULE.WALLETS)
        .insert(walletData)
        .returning('*');
    }

    const [wallets] = walletsQUery;

    if (!wallets) {
      await transaction.rollback();
      const newError = new Error(`No wallet create`);
      newError.detail = `No wallet create`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const amount = data.balance;
    const walletTransactionsData = {
      wallets: wallets.id,
      type: TRANSACTION_TYPE.CREDIT,
      amount,
      note: data.note,
      on_behalf: data.person,
      reference_id: appointment.code,
    };

    const [walletTransactions] = await transaction(MODULE.WALLET_TRANSCATIONS)
      .insert(walletTransactionsData)
      .returning('*');

    if (!walletTransactions) {
      await transaction.rollback();
      const newError = new Error(`No wallet transaction create`);
      newError.detail = `No wallet transaction create`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // console.log('wallets', wallets);
    // console.log('walletTransactions', walletTransactions);

    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return wallets;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateWallet = async (param, data) => {
  const transaction = await knex.transaction();
  try {
    const wallet = await transaction(MODULE.WALLETS)
      .where('id', param.wallets)
      .first();
    if (!wallet) {
      await transaction.rollback();
      const newError = new Error(`No wallet found`);
      newError.detail = `No wallet found`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const walletTransactionQuery = await transaction(MODULE.WALLET_TRANSCATIONS)
      .where({ wallets: wallet.id })
      .orderBy('id', 'desc')
      .first();

    const userBalance = parseInt(wallet.balance, 10);
    const newBalance = parseInt(data.balance, 10);
    const balance = userBalance - newBalance;
    // console.log('balance::::::', balance);
    let walletStatus = WALLET_STATUS.BALANCE;
    if (balance <= 0) {
      walletStatus = WALLET_STATUS.COMPLETED;
    }

    const [updateWalletQUery] = await transaction(MODULE.WALLETS)
      .update({ balance, status: walletStatus, updated_date: new Date() })
      .where('id', param.wallets)
      .returning('*');

    // console.log('updateWalletQUery::::::', updateWalletQUery);

    if (!updateWalletQUery) {
      await transaction.rollback();
      const newError = new Error(`No wallet update`);
      newError.detail = `No wallet update`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    const [walletTransactions] = await transaction(MODULE.WALLET_TRANSCATIONS)
      .insert({
        wallets: wallet.id,
        type: TRANSACTION_TYPE.DEBIT,
        amount: data.balance,
        note: walletTransactionQuery.note,
        on_behalf: walletTransactionQuery.on_behalf,
        reference_id: walletTransactionQuery.reference_id,
      })
      .returning('*');

    if (!walletTransactions) {
      await transaction.rollback();
      const newError = new Error(`No wallet transaction create`);
      newError.detail = `No wallet transaction create`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    // await transaction.rollback();
    const commit = await transaction.commit();
    if (commit.response.rowCount !== null) {
      await transaction.rollback();
      const newError = new Error(`Commit`);
      newError.detail = `Commit service is not execute`;
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }
    return updateWalletQUery;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const transactions = async (param) => {
  const query = knex(`${MODULE.WALLET_TRANSCATIONS}`)
    .where('wallets', param.wallets)
    // .whereRaw('created_date', [param.to, param.from]);
    .whereRaw(`created_date::date BETWEEN DATE(:to) AND DATE(:from)`, {
      to: param.to,
      from: param.from,
    });

  const totalCreditQUery = query
    .clone()
    .sum('amount')
    .where('type', TRANSACTION_TYPE.CREDIT);
  const totalDebitQuery = query
    .clone()
    .sum('amount')
    .where('type', TRANSACTION_TYPE.DEBIT);

  const walletTransactions = knex.raw(
    `
      SELECT wt.*
      FROM wallet_transactions as wt
      WHERE wt.wallets = :wallets
      AND wt.created_date::date BETWEEN DATE(:to) AND DATE(:from)
      LIMIT :size 
      OFFSET :offset
    `,
    {
      wallets: param.wallets,
      to: param.to,
      from: param.from,
      size: param.size,
      offset: param.page * param.size,
    }
  );

  const multiQuery = [
    query.count(),
    totalCreditQUery,
    totalDebitQuery,
    walletTransactions,
  ].join(';');

  const [
    {
      rows: [total],
    },
    {
      rows: [totalCredit],
    },
    {
      rows: [totalDebit],
    },
    { rows: totalList },
  ] = await knex.raw(multiQuery);

  return {
    totalList,
    totalCredit: Number(totalCredit.sum ?? 0),
    totalDebit: Number(totalDebit.sum ?? 0),
    total: parseInt(total.count, 10),
  };
};

module.exports = {
  list,
  create,
  updateWallet,
  transactions,
};
