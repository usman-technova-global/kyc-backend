// const { v4: uuidv4 } = require('uuid');
const { default: axios } = require('axios');
const Model = require('./appointment.model');
const caseConversion = require('../../../utils/commonUtils/caseConversion');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const logger = require('../../../utils/commonUtils/logger').appLogger;
const adminAppointmentModel = require('../../admin/store/appointment/appointment.model');
const MODULE = require('../../../utils/constants/moduleNames');

const moduleName = 'Appointment';

const list = async (uriParams) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.list(uriParams);
    if (findResult) {
      result.items = findResult;
      result = { ...result };
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const categories = async (session) => {
  let result = { hasError: false };
  try {
    let uriParams = {
      ...session,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findList = await Model.categories(uriParams);
    if (findList.length) {
      result = { ...result, items: findList };
      result.message = `Store service category lov ${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `No store service category lov is available.`;
      logger.error(`No store service category lov is available. ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to find store service category lov ${moduleName}.
    Error:: ${error}
    Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

const categoryItems = async (query, param, session) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findList = await Model.categoryItems(uriParams);
    if (findList) {
      result.items.total = parseInt(findList.total, 10);
      result.items.list = findList.totalList;
      result = { ...result };
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const serviceCategoryItem = async (query, param, session) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
      ...param,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findRecord = await Model.serviceCategoryItem(uriParams);
    if (findRecord) {
      result.item = findRecord;
      result = { ...result };
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};
const serviceProviders = async (uriParams) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.serviceProviders(uriParams);
    if (findResult) {
      result.items = findResult;
      // result = { ...result };
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const linedUp = async (uriParams) => {
  const result = { hasError: false };
  try {
    const findResult = await adminAppointmentModel.linedUp(uriParams);
    if (findResult) {
      result.items = findResult;
      // result = { ...result };
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const create = async (uriParams, body) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const newUriParams = { ...uriParams, tenant: uriParams.tenantId };
    const createResult = await Model.create(newUriParams, newBody);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} create has been add successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}.`;
      logger.error(`Unable to create ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const reSchedule = async (uriParams, body) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    const newUriParams = { ...uriParams, tenant: uriParams.tenantId };
    newBody = caseConversion.toSnakeCase(newBody);
    const createResult = await Model.reSchedule(newUriParams, newBody);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} reSchedule has been create successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to reSchedule ${moduleName}.`;
      logger.error(`Unable to reSchedule ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to reSchedule ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const ratinglist = async (uriParams) => {
  const result = { hasError: false };
  try {
    const createResult = await Model.ratinglist(uriParams);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} list has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to fetch ${moduleName} list.`;
      logger.error(`Unable to fetch ${moduleName} list`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const rating = async (uriParams, body) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const createResult = await Model.rating(uriParams, newBody);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} rating has been updated successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName} rating.`;
      logger.error(`Unable to update ${moduleName} rating`);
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName} rating.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const leaveManagement = async (uriParams) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.leaveManagement(uriParams);
    result.item = findResult;
    result.message = `Day available for appointment.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const leaveManagementForEmployees = async (uriParams) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.leaveManagementForEmployees(uriParams);
    result.item = findResult;
    result.message = `Day available for appointment.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const appointmentUsers = async (uriParams) => {
  const result = { hasError: false };
  try {
    const findAppointmentByUsers = await Model.appointmentUsers(uriParams);
    result.items = findAppointmentByUsers;
    result.message = `Appointment users fetch list is successfull.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const userAppointmentsByDates = async (uriParams) => {
  const result = { hasError: false };
  try {
    const findAppointmentByUsers =
      await Model.userAppointmentsByDates(uriParams);
    result.items = findAppointmentByUsers;
    result.message = `Appointment users fetch list is successfull.`;
    result.code = HTTP_STATUS.OK;
  } catch (error) {
    logger.error(
      `Unable to fetch list ${moduleName} list.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

async function orderStatusUpdatePayFast(orderId) {
  try {
    const result = await Model.orderStatusUpdatePayFast(orderId);
    if (result) {
      return result;
    }
    return null;
  } catch (error) {
    logger.error(
      `An error occurred updating order status. ${MODULE.STORE.APPOINTMENT}
      Error:: ${error}
      Trace:: ${error.stack}
      OrderId:: ${orderId}`
    );
    return null;
  }
}

async function getPayfastAccessToken() {
  let appOrder = { hasError: false };
  const BASE_URL = `${process.env.WEB_SERVER_PROTOCOL}://${process.env.REDIRECT_HOST}${process.env.WEB_SERVER_BASEPATH}/public`;
  const PAYFAST_WEB_HOOK_URL = `${process.env.WEB_SERVER_PROTOCOL}://${process.env.REDIRECT_HOST}${process.env.WEB_SERVER_BASEPATH}/app/appointment/pay-fast/webhook`;
  const data = {
    MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID,
    SECURED_KEY: process.env.PAYFAST_SECURED_KEY,
  };
  try {
    const response = await axios.post(
      'https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken',
      data
    );
    if (response.status === HTTP_STATUS.OK) {
      if (!response.data.ACCESS_TOKEN) {
        const payFastError = new Error(response.data.errorDescription);
        payFastError.detail = response.data.errorDescription;
        payFastError.errorCode = response.data.errorCode;
        throw payFastError;
      }

      appOrder = {
        ...appOrder,
        data: {
          ...response.data,
          success_url: `${BASE_URL}/success.html`,
          cancel_url: `${BASE_URL}/cancel.html`,
          pay_fast_hook_url: PAYFAST_WEB_HOOK_URL,
        },
      };
      appOrder.message = `access token has been sent`;
    } else {
      appOrder.hasError = true;
      appOrder.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appOrder.message = `unable to create access token`;
      logger.error(`unable to create access token ${MODULE.APP.ORDER}`);
    }
  } catch (error) {
    logger.error(
      `An error occurred while getting access token order. ${MODULE.APP.ORDER}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    appOrder.hasError = true;
    appOrder.message = error.detail;
    appOrder.code = error.code;
  }
  return caseConversion.toCamelCase(appOrder);
}

async function storePayFastLogs(log) {
  return Model.storePayFastLogs(log);
}

module.exports = {
  list,
  categories,
  categoryItems,
  serviceProviders,
  linedUp,
  create,
  ratinglist,
  rating,
  reSchedule,
  leaveManagement,
  appointmentUsers,
  userAppointmentsByDates,
  storePayFastLogs,
  orderStatusUpdatePayFast,
  leaveManagementForEmployees,
  getPayfastAccessToken,
  serviceCategoryItem,
};
