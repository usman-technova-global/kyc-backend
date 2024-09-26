// const { v4: uuidv4 } = require('uuid');
const Model = require('./appointment.model');
// const employeeModel = require('../employee/employee.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
// const {
//   prettyPrintJSON,
// } = require('../../../../utils/commonUtils/prettyPrintJSON');

const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const {
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
} = require('../../../../utils/constants/enumConstants');

const weekly = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.weekly(uriParams);
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

const distinctWeekly = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.distinctWeekly(uriParams);
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

const weeklyIndividual = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.weeklyIndividual(uriParams);
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

const monthly = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.monthly(uriParams);
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

const distinctMonthly = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.distinctMonthly(uriParams);
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

const monthlyIndividual = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.monthlyIndividual(uriParams);
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

const getAppointment = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.getAppointment(uriParams);
    if (findResult) {
      result.item = findResult;
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

const getAppointmentByCode = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.getAppointmentByCode(uriParams);
    if (findResult) {
      result.item = findResult;
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

const employeeLov = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.employeeLov(uriParams);
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

const linedUp = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.linedUp(uriParams);
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

const create = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    // console.log('newBody::::::', newBody);
    const createResult = await Model.create(uriParams, newBody);
    // console.log('createResult:::::::', createResult);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} has been created successfully.`;
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
    // console.log('error', error);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const pengCreate = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    // console.log('newBody::::::', newBody);
    const createResult = await Model.pengCreate(uriParams, newBody);
    // console.log('createResult:::::::', createResult);
    if (createResult) {
      result.item = createResult;
      result.message = `${moduleName} has been created successfully.`;
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
    // console.log('error', error);
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const individualReSchedule = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const rescheduleResult = await Model.individualReSchedule(
      uriParams,
      newBody
    );
    if (rescheduleResult) {
      result.item = rescheduleResult;
      result.message = `${moduleName} reSchedule has been add successfully.`;
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

const reSchedule = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const rescheduleResult = await Model.reSchedule(uriParams, newBody);
    if (rescheduleResult) {
      result.item = rescheduleResult;
      result.message = `${moduleName} reSchedule has been add successfully.`;
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

const update = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody = caseConversion.toSnakeCase(newBody);
    const [updateResult] = await Model.update(uriParams, newBody);
    if (updateResult) {
      result.item = updateResult;
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

const updateStatus = async (moduleName, uriParams, body, logger) => {
  const result = { hasError: false };
  let newBody = body;
  try {
    newBody.updated_date = new Date();
    newBody = caseConversion.toSnakeCase(newBody);
    const [updateResult] = await Model.statusUpdate(
      uriParams.storeAppointment,
      newBody
    );
    if (updateResult) {
      result.item = updateResult;
      result.message = `${moduleName} has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to status update ${moduleName}.`;
      logger.error(`Unable to status update ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to fetch status update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const serviceDetail = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.serviceDetail(uriParams);
    if (findResult) {
      result.item = findResult;
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

const servicePaid = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const newData = {
      status: APPOINTMENT_STATUS.COMPLETED,
      payment_status: PAYMENT_STATUS.PAID,
    };
    const updateResult = await Model.servicePaid(uriParams, newData);
    if (updateResult) {
      result.items = updateResult;
      result.message = `${moduleName} has been updated successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}.`;
      logger.error(`Unable to update ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const serviceDone = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const newData = {
      status: APPOINTMENT_STATUS.DONE,
    };
    const updateResult = await Model.serviceDone(uriParams, newData);
    if (updateResult) {
      result.item = updateResult;
      result.message = `${moduleName} has been updated successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}.`;
      logger.error(`Unable to update ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const allServicesCancell = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const newData = {
      status: APPOINTMENT_STATUS.CANCELLED,
    };
    const serviceResult = await Model.allServicesCancell(uriParams, newData);
    if (serviceResult && serviceResult.length) {
      result.items = serviceResult;
      result.message = `${moduleName} has been cancelled successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to cancell ${moduleName}.`;
      logger.error(`Unable to cancell ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to cancell ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const serviceCancell = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const newData = {
      status: APPOINTMENT_STATUS.CANCELLED,
    };
    newData.updated_date = new Date();
    const [updateResult] = await Model.statusUpdate(
      uriParams.storeAppointment,
      newData
    );
    if (updateResult) {
      result.item = updateResult;
      result.message = `${moduleName} has been cancelled successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to cancell ${moduleName}.`;
      logger.error(`Unable to cancell ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to cancell ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const getAppointmentList = async (moduleName, params, logger) => {
  const result = { hasError: false };
  try {
    const data = await Model.fetchAppointments(params);
    // console.log('data:::::::', data);
    if (data) {
      result.item = data;
      result.message = `${moduleName} has been fetched successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to Fetch ${moduleName}.`;
      logger.error(`Unable to Fetch ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to Fetch ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const serviceProcessing = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findById = await Model.findById(uriParams.storeAppointment);
    if (!findById || findById.status !== APPOINTMENT_STATUS.NEW) {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Appointment not found.`;
      logger.error(`Appointment not found`);
      return caseConversion.toCamelCase(result);
    }
    const newData = {
      status: APPOINTMENT_STATUS.PROCESSING,
    };
    newData.updated_date = new Date();
    const [updateResult] = await Model.processingAppointment(
      uriParams.storeAppointment,
      newData
    );
    if (updateResult) {
      result.item = updateResult;
      result.message = `${moduleName} has been processing successfully.`;
      result.code = HTTP_STATUS.OK;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to process ${moduleName}.`;
      logger.error(`Unable to process ${moduleName}`);
    }
  } catch (error) {
    logger.error(
      `Unable to process ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const appointmentInvoice = async (moduleName, uriParams, logger) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.appointmentInvoice(uriParams);
    if (findResult) {
      result.item = findResult;
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

const appointmentInvoiceByStatusDone = async (
  moduleName,
  uriParams,
  logger
) => {
  const result = { hasError: false };
  try {
    const findResult = await Model.appointmentInvoiceByStatusDone(uriParams);
    if (findResult) {
      result.item = findResult;
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

module.exports = {
  weekly,
  weeklyIndividual,
  monthly,
  monthlyIndividual,
  employeeLov,
  linedUp,
  create,
  serviceDetail,
  getAppointment,
  servicePaid,
  update,
  reSchedule,
  serviceCancell,
  getAppointmentList,
  serviceProcessing,
  updateStatus,
  pengCreate,
  distinctWeekly,
  distinctMonthly,
  getAppointmentByCode,
  appointmentInvoice,
  allServicesCancell,
  individualReSchedule,
  appointmentInvoiceByStatusDone,
  serviceDone,
};
