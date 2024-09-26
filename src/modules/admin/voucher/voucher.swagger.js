const swagger = {
  createVoucher: {
    schema: {
      description: 'this will create voucher',
      tags: ['admin|Voucher'],
      summary: 'create vouchers',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
      },
      body: {
        type: 'object',
        properties: {
          discountType: { type: 'string', enum: ['Amount', 'Percentage'] },
          validFrom: { type: 'string', format: 'date-time' },
          validTill: { type: 'string', format: 'date-time' },
          value: { type: 'number', format: 'float' },
          minAmount: { type: 'number', format: 'float' },
          maxRedeem: { type: 'number', format: 'int32' },
          isActive: { type: 'boolean' },
          type: { type: 'string', enum: ['Referral', 'Promo'] },
          backOfficeUser: { type: 'string', format: 'uuid' },
          voucherCode: { type: 'string' },
          isUnlimitedRedeem: { type: 'boolean' },
          maxUserRedeem: { type: 'number', format: 'int32', default: 0 },
        },
        required: [
          'discountType',
          'validFrom',
          'validTill',
          'value',
          'minAmount',
          'maxRedeem',
          'isActive',
          'type',
          'backOfficeUser',
          'voucherCode',
        ],
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

  getVoucher: {
    schema: {
      description: 'this will fetch vouchers',
      tags: ['admin|Voucher'],
      summary: 'get vouchers',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
      },
      querystring: {
        limit: { type: 'integer', minimum: 10, default: 10 },
        offset: { type: 'integer', minimum: 0, default: 0 },
        search: { type: 'string', default: '' },
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

  updateVoucher: {
    schema: {
      description: 'this will create voucher',
      tags: ['admin|Voucher'],
      summary: 'create vouchers',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
        id: { type: 'string', format: 'uuid' },
      },
      body: {
        type: 'object',
        properties: {
          discountType: { type: 'string', enum: ['Amount', 'Percentage'] },
          validFrom: { type: 'string', format: 'date-time' },
          validTill: { type: 'string', format: 'date-time' },
          value: { type: 'number', format: 'float' },
          minAmount: { type: 'number', format: 'float' },
          maxRedeem: { type: 'number', format: 'int32' },
          isActive: { type: 'boolean' },
          type: { type: 'string', enum: ['Referral', 'Promo'] },
          backOfficeUser: { type: 'string', format: 'uuid' },
          voucherCode: { type: 'string' },
          isUnlimitedRedeem: { type: 'boolean' },
          maxUserRedeem: { type: 'number', default: 0 },
        },
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

  deleteVoucher: {
    schema: {
      description: 'this will delete voucher',
      tags: ['admin|Voucher'],
      summary: 'delete vouchers',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
        id: { type: 'string', format: 'uuid' },
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
  updateStatus: {
    schema: {
      description: 'this will update status voucher',
      tags: ['admin|Voucher'],
      summary: 'update status vouchers',
      params: {
        tenantId: { type: 'string', format: 'uuid' },
        id: { type: 'string', format: 'uuid' },
      },
      body: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          isActive: { type: 'boolean' },
          updatedBy: { type: 'string', format: 'uuid' },
        },
        required: ['id', 'isActive', 'updatedBy'],
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
  promotion: {
    schema: {
      description: 'this will promotion',
      tags: ['admin|Voucher'],
      summary: 'promotion',
      params: {
        tenant: { type: 'string', format: 'uuid' },
        appUser: { type: 'string', format: 'uuid' },
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
