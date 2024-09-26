const swagger = {
  list: {
    schema: {
      description: 'this will list wallet',
      tags: ['admin|Wallet'],
      summary: 'wallet list',
      querystring: {
        search: { type: 'string', description: 'text to filter order with' },
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  create: {
    schema: {
      description: 'this will insert new wallet',
      tags: ['admin|Wallet'],
      summary: 'create new wallet',
      body: {
        type: 'object',
        properties: {
          balance: { type: 'integer', format: 'int32' },
          referenceId: { type: 'string', format: 'uuid' },
          note: { type: 'string', default: null },
          person: { type: 'string' },
        },
        required: ['balance', 'referenceId', 'person'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  updateWallet: {
    schema: {
      description: 'this will update wallet',
      tags: ['admin|Wallet'],
      summary: 'update wallet',
      params: {
        type: 'object',
        properties: {
          wallets: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['wallets'],
        additionalProperties: false,
      },
      body: {
        type: 'object',
        properties: {
          balance: { type: 'integer', format: 'int32' },
        },
        required: ['balance'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
  transactions: {
    schema: {
      description: 'this will search transactions history',
      tags: ['admin|Wallet'],
      summary: 'search transactions history',
      querystring: {
        page: { type: 'integer', format: 'int32', minimum: 0 },
        size: { type: 'integer', format: 'int32', minimum: 10 },
        to: { type: 'string', format: 'date' },
        from: { type: 'string', format: 'date' },
      },
      params: {
        type: 'object',
        properties: {
          wallets: {
            type: 'string',
            format: 'uuid',
          },
        },
        required: ['wallets'],
        additionalProperties: false,
      },
      headers: {
        type: 'object',
        properties: {
          Authorization: { type: 'string' },
        },
        required: ['Authorization'],
      },
    },
  },
};

module.exports = swagger;
