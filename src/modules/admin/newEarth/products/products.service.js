const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line no-restricted-syntax
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');
const Model = require('./products.model');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');

// Helper functions
const isValidMimeType = (mimeType) => {
  const validMimeTypes = [
    'image/jpeg',
    'image/png',
    // Add more MIME types as needed
  ];
  return validMimeTypes.includes(mimeType);
};

const uploadFileToBucket = async (file) => {
  if (file !== undefined) {
    const fileData = {
      Key: `new-earth/product-images/${uuidv4()}-${file.filename}`,
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

const list = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.list(uriParams);
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

const create = async (moduleName, uriParams, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  newBody.features = JSON.parse(newBody.features);
  try {
    let files = newBody.productImages;
    if (!Array.isArray(files)) {
      files = [files];
    }
    const uploadedFilePaths = [];
    // Use a for loop to iterate through files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (
        !file ||
        file.type !== 'file' ||
        !isValidMimeType(file.mimetype) // Assuming isValidMimeType is a custom function you have for MIME type validation
      ) {
        logger.error(
          `Unable to process ${moduleName}.
            Error:: Invalid File Input.
            Trace:: attachment.service.js`
        );
        result.hasError = true;
        result.message = 'Invalid file upload!';
        result.code = HTTP_STATUS.BAD_REQUEST;
        return caseConversion.toCamelCase(result);
      }

      // Upload the file to the bucket
      const filePath = uploadFileToBucket(file);
      if (filePath) {
        uploadedFilePaths.push(filePath);
      } else {
        logger.error(
          `Failed to upload ${moduleName} file to the bucket.
            Trace:: attachment.service.js`
        );
        result.hasError = true;
        result.message = 'Failed to upload file!';
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        return caseConversion.toCamelCase(result);
      }
    }
    newBody.productImages = uploadedFilePaths;
    newBody.productCustomization = newBody.productCustomization
      ? JSON.stringify(newBody.productCustomization)
      : null;
    newBody = caseConversion.toSnakeCase(newBody);
    const insertData = await Model.create(newBody);
    if (insertData) {
      const [setInsertedDate] = insertData;
      result = { ...result, item: setInsertedDate };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}.
      Payload:: ${prettyPrintJSON(result)}`
      );
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to create ${moduleName}.
    Error:: ${error}
    Trace:: ${error.stack}
    Payload:: ${prettyPrintJSON(newBody)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return caseConversion.toCamelCase(result);
};

module.exports = {
  list,
  create,
};
