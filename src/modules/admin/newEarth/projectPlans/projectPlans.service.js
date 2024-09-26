const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const XLSX = require('xlsx');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const Model = require('./projectPlans.model');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');

const requiredHeaders = [
  'Supervisor',
  'Job Type',
  'Stage',
  'Room',
  'Activity',
  'Count',
  'Progress',
  'Remarks',
];
const sheetNamePattern = /^Day \d+$/; // Matches "Day 01", "Day 02", etc.

/**
 *
 * @param {XLSX.WorkBook} workbook
 * @param {string[]} sheetNames
 */
const validatePlanFile = (workbook, sheetNames) => {
  const errors = [];
  // Validate sheet names and headers
  const invalidSheet = sheetNames.find((sheetName) => {
    // Check if sheet name is valid
    if (!sheetNamePattern.test(sheetName)) {
      errors.push(
        `Invalid sheet name: ${sheetName}. Expected format: "Day [Number]"`
      );
      return true; // Exit early if invalid sheet name found
    }

    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Validate headers
    const headers = jsonData[0];
    if (!headers) {
      errors.push(
        `Sheet ${sheetName} is missing headers. Expected headers: ${requiredHeaders.join(', ')}`
      );
      return true; // Exit early if no headers are found
    }

    // Ensure all required headers are present (order doesn't matter)
    const missingHeaders = requiredHeaders.filter(
      (requiredHeader) => !headers.includes(requiredHeader)
    );

    if (missingHeaders.length > 0) {
      errors.push(
        `Missing required headers in sheet ${sheetName}: ${missingHeaders.join(', ')}`
      );
      return true; // Exit early if any required headers are missing
    }

    return false; // No issues found
  });

  return {
    hasError: !!invalidSheet,
    errors,
  };
};

const uploadFileToBucket = async (file) => {
  if (file !== undefined) {
    const fileData = {
      Key: `sheet/${uuidv4()}-${file.filename}`,
      Body: file.buffer,
      'Content-Type': file.mimetype,
    };
    const img = await uploader.uploadToAdminBucket(fileData);
    if (img) {
      return img.Location;
    }
  }
  return null;
};

const processPlanFile = async (moduleName, req, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const data = await req.body.planFile;

    if (
      !data ||
      data.type !== 'file' ||
      data.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      logger.error(
        `Unable to Read ${moduleName} .
        Error:: Invalid File Input.
        Trace:: ProjectPlan.service.js`
      );

      result.hasError = true;
      result.message = 'Invalid file upload!';
      result.code = HTTP_STATUS.BAD_REQUEST;
      return caseConversion.toCamelCase(result);
    }

    //  Read and Process the Excel File
    const workbook = XLSX.read(data.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;

    // Validate sheet names and headers
    const invalidSheet = validatePlanFile(workbook, sheetNames);

    // If invalidSheet is found, we already sent a response, so return early
    if (invalidSheet.hasError) {
      result.hasError = true;
      result.message = `Validation failed! Errors: ${invalidSheet.errors.join(', ')}`;
      result.code = HTTP_STATUS.BAD_REQUEST;
      return caseConversion.toCamelCase(result);
    }

    const filePath = await uploadFileToBucket(data);

    // Iterate Over Each Sheet and Read Data
    const sheetsData = sheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      return {
        sheetName,
        data: jsonData,
      };
    });

    const insertData = await Model.storeProjectPlans(
      { ...req.params, ...req.body, filePath },
      sheetsData
    );

    if (insertData && Object.keys(insertData).length > 0) {
      result = { ...result, item: insertData };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}. Payload:: ${prettyPrintJSON(result)}`
      );
    }

    result.items.list = insertData;
    result.items.total = insertData.length;
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

const planList = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.planListService(uriParams);
    if (findResult) {
      result.items.total = parseInt(findResult.total, 10);
      result.items.list = findResult.totalList;
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

const planLOV = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.planLOVService(uriParams);
    if (findResult) {
      result.items.total = parseInt(findResult.total, 10);
      result.items.list = findResult.totalList;
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

const updatePlans = async (moduleName, req, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const data = await req.body.planFile;

    if (
      !data ||
      data.type !== 'file' ||
      data.mimetype !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      logger.error(
        `Unable to Read ${moduleName} .
        Error:: Invalid File Input.
        Trace:: ProjectPlan.service.js`
      );

      result.hasError = true;
      result.message = 'Invalid file upload!';
      result.code = HTTP_STATUS.BAD_REQUEST;
      return caseConversion.toCamelCase(result);
    }

    //  Read and Process the Excel File
    const workbook = XLSX.read(data.buffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;

    // Validate sheet names and headers
    const invalidSheet = validatePlanFile(workbook, sheetNames);

    // If invalidSheet is found, we already sent a response, so return early
    if (invalidSheet.hasError) {
      result.hasError = true;
      result.message = `Validation failed! Errors: ${invalidSheet.errors.join(', ')}`;
      result.code = HTTP_STATUS.BAD_REQUEST;
      return caseConversion.toCamelCase(result);
    }

    const filePath = await uploadFileToBucket(data);

    // Iterate Over Each Sheet and Read Data
    const sheetsData = sheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      return {
        sheetName,
        data: jsonData,
      };
    });

    const insertData = await Model.updateProjectPlans(
      { ...req.params, ...req.body, filePath },
      sheetsData
    );

    if (insertData && Object.keys(insertData).length > 0) {
      result = { ...result, item: insertData };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}. Payload:: ${prettyPrintJSON(result)}`
      );
    }

    result.items.list = insertData;
    result.items.total = insertData.length;
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
  processPlanFile,
  planList,
  updatePlans,
  planLOV,
};
