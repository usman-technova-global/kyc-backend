const shopEventHolidayModel = require('./shopEventHoliday.model');
const settingModel = require('../appSetting/setting.model');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');

const moduleName = 'Shop Schedule';

const get = async (tenant, date, logger) => {
  let result = { hasError: false, data: {} };
  try {
    const getResult = await Promise.all([
      settingModel.findById(tenant),
      shopEventHolidayModel.getMonthEvents(tenant, date),
    ]);
    if (getResult) {
      result = {
        ...result,
        data: {
          workDays: getResult[0].shop_schedule ?? [],
          eventDays: getResult[1],
        },
      };
      result.message = `${moduleName} has been fetched successfully.`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `${moduleName} does not found, please check the id.`;
      logger.error(
        `${moduleName} does not found.
        Id:: ${tenant}`
      );
    }
  } catch (error) {
    logger.error(
      `${moduleName} does not found.
      Id:: ${tenant}
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const setWorkDays = async (tenant, body) => {
  const configData = {
    shop_schedule: body.workDays ? JSON.stringify(body.workDays) : null,
  };
  const updated = await shopEventHolidayModel.setTenantConfigShopSchedule(
    tenant,
    configData
  );

  if (updated) {
    const tenetConfig = await settingModel.findById(tenant);
    return tenetConfig;
  }
  return updated;
};

const setEventHolidays = async (tenant, body) => {
  const events =
    body.eventDays.map((h) => {
      const holiday = caseConversion.toSnakeCase(h);
      return {
        tenant,
        event: holiday.event,
        start_date: holiday.start_date,
        end_date: holiday.end_date,
      };
    }) || [];

  const eventHolidays = await shopEventHolidayModel.setMonthEvent(
    tenant,
    events,
    body.date
  );

  return eventHolidays;
};

const setSchedule = async (param, body, logger) => {
  let result = { hasError: false, data: {} };
  try {
    const tenetConfig = await setWorkDays(param.tenant, body);
    if (tenetConfig) {
      result = {
        ...result,
        data: { ...result.data, workDays: tenetConfig.shop_schedule ?? [] },
      };
    }
    const eventHolidays = await setEventHolidays(param.tenant, body);
    if (eventHolidays) {
      result = {
        ...result,
        data: { ...result.data, eventDays: eventHolidays },
      };
    }
    result.message = `${moduleName} has been updated successfully.`;
  } catch (error) {
    logger.error(
      `Unable to update ${moduleName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(body)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  // return result;
  return caseConversion.toCamelCase(result);
};

module.exports = { get, setSchedule };
