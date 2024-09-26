const logger = require('../../../../utils/commonUtils/logger').adminLogger;
const caseConversion = require('../../../../utils/commonUtils/caseConversion');

const {
  apiSuccessResponse,
  apiFailResponse,
  validationError,
} = require('../../../../utils/commonUtil');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const Service = require('./employee.service');

const validator = require('./employee.validator');

const moduleName = 'Employee';

const list = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.list(moduleName, req.query, req.session, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeList = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.employeeList(
      moduleName,
      req.query,
      req.session,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const create = async (req, res) => {
  let services = null;
  if (req.body.services) {
    services = JSON.parse(req.body.services);
    const servicesValid = validator.services(services);
    if (!servicesValid) {
      return validationError(res, validator.services);
    }
  }

  const workDays = JSON.parse(req.body.workDays);
  const workDaysValid = validator.workDays(workDays);
  if (!workDaysValid) {
    return validationError(res, validator.workDays);
  }

  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.create(
      moduleName,
      req.session,
      { ...req.body, services, workDays },
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} create service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const find = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.find(
      moduleName,
      req.session,
      req.params,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const update = async (req, res) => {
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);

  let services = null;
  if (req.body.services) {
    services = JSON.parse(req.body.services);
    const servicesValid = validator.services(services);
    if (!servicesValid) {
      return validationError(res, validator.services);
    }
  }

  let deletedIds = [];
  if (req.body.deletedIds) {
    deletedIds = JSON.parse(req.body.deletedIds);
    const deletedIdsValid = validator.deletedIds(deletedIds);
    if (!deletedIdsValid) {
      return validationError(res, validator.deletedIds);
    }
  }

  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.update(
      moduleName,
      uriParams,
      { ...req.body, services, deletedIds },
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} create service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const updateStatus = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.updateStatus(
      moduleName,
      req.session,
      req.params,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeDelete = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    const data = await Service.employeeDelete(
      moduleName,
      req.session,
      req.params,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeServiceList = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeServiceList(
      moduleName,
      uriParams,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeServiceLov = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeServiceLov(
      moduleName,
      uriParams,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeLov = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeLov(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeServiceCreate = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeServiceCreate(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeServiceUpdate = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeServiceUpdate(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeServiceUpdateStatus = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeServiceUpdateStatus(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeServiceDelete = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  let uriParams = {
    ...req.session,
    ...req.params,
    ...req.query,
  };
  uriParams = caseConversion.toCamelCase(uriParams);
  try {
    const data = await Service.employeeServiceDelete(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeScheduleList = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.employeeScheduleList(
      moduleName,
      uriParams,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeScheduleCreate = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.employeeScheduleCreate(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} create service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeScheduleUpdate = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.employeeScheduleUpdate(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const employeeScheduleUpdateStatus = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.employeeScheduleUpdateStatus(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} update status service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const attendanceList = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.attendanceList(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const leave = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.leave(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const leaveManagement = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.leaveManagement(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const detail = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.detail(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const reviews = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.reviews(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const distinctStarList = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.distinctStarList(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const leaveManagementUpdateStatus = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.leaveManagementUpdateStatus(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.item));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const expenseList = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.expenseList(moduleName, uriParams, logger);
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} list service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const expenseCreate = async (req, res) => {
  logger.verbose(`Handling ${req.method} ${req.url} Route`);
  try {
    let uriParams = {
      ...req.session,
      ...req.params,
      ...req.query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const data = await Service.expenseCreate(
      moduleName,
      uriParams,
      req.body,
      logger
    );
    if (data && !data.hasError) {
      logger.verbose(
        `Handling Completed With Success On ${req.method} ${req.url} Route`
      );
      return res
        .status(HTTP_STATUS.OK)
        .send(apiSuccessResponse(data.message, data.items));
    }
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    return res
      .status(HTTP_STATUS.OK)
      .send(apiFailResponse(data.message, {}, data.code));
  } catch (error) {
    logger.verbose(
      `Handling Completed With Error On ${req.method} ${req.url} Route`
    );
    logger.error(
      `Error in calling ${moduleName} create service.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    return res.status(HTTP_STATUS.OK).send(
      apiFailResponse(
        `Something went wrong, please try again later.
        Error:: ${error}`,
        {},
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    );
  }
};

module.exports = {
  list,
  create,
  find,
  update,
  updateStatus,
  employeeDelete,
  employeeServiceList,
  employeeServiceCreate,
  employeeServiceUpdate,
  employeeServiceUpdateStatus,
  employeeServiceDelete,
  employeeScheduleList,
  employeeScheduleCreate,
  employeeScheduleUpdate,
  employeeScheduleUpdateStatus,
  attendanceList,
  leave,
  detail,
  reviews,
  distinctStarList,
  leaveManagement,
  leaveManagementUpdateStatus,
  employeeList,
  employeeServiceLov,
  expenseList,
  expenseCreate,
  employeeLov,
};
