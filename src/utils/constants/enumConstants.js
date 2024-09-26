const ENUM_CONSTANT = Object.freeze({
  ADDRESS_TYPE: Object.freeze({
    HOME: 'Home',
    OFFICE: 'Office',
    OTHER: 'Other',
  }),

  ADMIN_VOUCHER_STATUS: Object.freeze({
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DELETED: 'Deleted',
    EXPIRED: 'Expired',
  }),

  APP_CART_STATUS: Object.freeze({
    NEW: 'New',
    PROCESSING: 'Processing',
    ABANDONED: 'Abandoned',
    COMPLETED: 'Completed',
  }),

  APP_ORDER_STATUS: Object.freeze({
    NEW: 'New',
    DRIVER_ASSIGNED_FOR_ITEM_PICKUP: 'Driver-Assigned-For-Item-Pickup',
    DRIVER_ACCEPTED_TO_PICK_UP_ITEM_FROM_CUSTOMER:
      'Driver-Accepted-To-Pick-Up-Item-From-Customer',
    DRIVER_PICKED_UP_ITEM_FROM_CUSTOMER: 'Driver-Picked-Up-Item-From-Customer',
    DRIVER_DELIVERED_ITEM_TO_SHOP: 'Driver-Delivered-Item-To-Shop',
    DRIVER_DECLINED_TO_PICKUP_ITEM_FROM_CUSTOMER:
      'Driver-Declined-To-Pickup-Item-From-Customer',
    DRIVER_RETURNED_ITEM_TO_CUSTOMER: 'Driver-Returned-Item-To-Customer',
    PROCESSING_ITEM: 'Processing-Item',
    DRIVER_ASSIGNED_FOR_ITEM_DELIVERY: 'Driver-Assigned-For-Item-Delivery',
    DRIVER_ACCEPTED_TO_PICK_UP_ITEM_FROM_SHOP:
      'Driver-Accepted-To-Pick-Up-Item-From-Shop',
    DRIVER_PICKED_UP_ITEM_FROM_SHOP: 'Driver-Picked-Up-Item-From-Shop',
    DRIVER_DELIVERED_ITEM_TO_CUSTOMER: 'Driver-Delivered-Item-To-Customer',
    DRIVER_DECLINED_TO_PICKUP_ITEM_FROM_SHOP:
      'Driver-Declined-To-Pickup-Item-From-Shop',
    DRIVER_RETURNED_ITEM_TO_SHOP: 'Driver-Returned-Item-To-Shop',
    CUSTOMER_PICK_UP: 'Customer-Pick-Up',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }),

  APP_DRIVER_STATUS: Object.freeze({
    ONLINE: 'Online',
    OFFLINE: 'Offline',
  }),

  APP_ORDER_PAYMENT_STATUS: Object.freeze({
    PAID: 'Paid',
    UNPAID: 'Unpaid',
    REFUNDED: 'Refunded',
  }),

  APP_USER_TYPE: Object.freeze({
    APP: 'App',
    DRIVER: 'Driver',
    SHOP: 'Shop',
  }),

  APPOINTMENT_STATUS: Object.freeze({
    NEW: 'New',
    RESCHEDULE: 'Reschedule',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
    MISSED: 'Missed',
    DONE: 'Done',
    PROCESSING: 'Processing',
  }),

  BACK_OFFICE_USER_PASSWORD_TYPE: Object.freeze({
    NEW: 'New',
    EXISTING: 'Existing',
  }),

  BACK_OFFICE_USER_TYPE: Object.freeze({
    SUPER_ADMIN: 'SuperAdmin',
    SHOP_USER: 'ShopUser',
    BRANCH_USER: 'BranchUser',
    USER: 'User',
  }),

  BANNER_TYPE: Object.freeze({
    SLIDER: 'Slider',
    ONBOARD: 'Onboard',
    SPLASH: 'Splash',
  }),

  NOTIFICATION_STATUS_TYPE: Object.freeze({
    NEW: 'New',
    SENDING: 'Sending',
    FAILED: 'Failed',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }),

  ORDER_PAYMENT_TYPE: Object.freeze({
    CASH_ON_DELIVERY: 'CashOnDelivery',
    ONLINE: 'Online',
    SHOP: 'Shop',
  }),

  PAYMENT_GATEWAY_TYPE: Object.freeze({
    PAYFAST: 'PAYFAST',
    STRIPE: 'STRIPE',
  }),

  PERMISSION_TYPE: Object.freeze({
    FRONTEND: 'frontend',
    BACKEND: 'backend',
    HYBRID: 'hybrid',
  }),

  REWARDS_STATUS: Object.freeze({
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  }),

  TENANT_TYPE: Object.freeze({ SHOP: 'Shop', BRANCH: 'Branch' }),

  VOUCHER_DISCOUNT_TYPE: Object.freeze({
    AMOUNT: 'Amount',
    PERCENTAGE: 'Percentage',
  }),

  VOUCHER_TYPE: Object.freeze({ REFERRAL: 'Referral', PROMO: 'Promo' }),

  WEEK_DAY: Object.freeze({
    SUNDAY: 'Sunday',
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
  }),

  RATING_STATUS: Object.freeze({
    PENDING: 'Pending',
    LEAVE: 'Leave',
    COMPLETED: 'Completed',
  }),

  PAYMENT_STATUS: Object.freeze({
    PAID: 'Paid',
    UNPAID: 'Unpaid',
  }),

  ATTENDANCE_TYPE: Object.freeze({
    TIME_IN: 'Timein',
    TIME_OUT: 'Timeout',
  }),

  LEAVE_STATUS: Object.freeze({
    PENDING: 'Pending',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
  }),

  LEAVE_TYPE: Object.freeze({
    SICK: 'Sick',
    PERSONAL: 'Personal',
    CASUAL: 'Casual',
  }),

  PAYROLL_TYPE: Object.freeze({
    SALARY: 'Salary',
    COMMISSION: 'Commission',
    BOTH: 'Both',
  }),

  AMOUNT_TYPE: Object.freeze({
    AMOUNT: 'Amount',
    PERCENTAGE: 'Percentage',
    NONE: 'None',
  }),

  NOTIFICATION_TYPE: Object.freeze({
    CUSTOMERS: 'Customers',
    STAFF_USERS: 'StaffUsers',
  }),

  WALLET_STATUS: Object.freeze({
    BALANCE: 'Balance',
    COMPLETED: 'Completed',
  }),

  REFERENCE_TYPE: Object.freeze({
    ORDER: 'Order',
    APPOINTMENT: 'Appointment',
    DRIVER: 'Driver',
  }),

  TRANSACTION_TYPE: Object.freeze({
    CREDIT: 'Credit',
    DEBIT: 'Debit',
  }),
  EXPENSE_TYPE: Object.freeze({
    NONE: 'None',
    SALARY: 'Salary',
    UTILITY: 'Utility',
    MAINTENANCE: 'Maintenance',
    EQUIPMENT_PURCHASE: 'EquipmentPurchase',
    OTHER: 'Other',
  }),
  USER_TYPE: Object.freeze({
    STAFF_USER: 'StaffUser',
    APP_USER: 'AppUser',
    EMPLOYEE: 'Employee',
  }),
  CUSTOMER_STATUS: Object.freeze({
    VERIFIED: 'verified',
    UNVERIFIED: 'unverified',
  }),
});

module.exports = ENUM_CONSTANT;
