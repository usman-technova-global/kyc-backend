const { v4: uuidv4 } = require('uuid');
const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const uploader = require('../../../../utils/s3Uploader/s3Uploader');
const caseConversion = require('../../../../utils/commonUtils/caseConversion');

const Model = require('./attachment.model');
const {
  prettyPrintJSON,
} = require('../../../../utils/commonUtils/prettyPrintJSON');

// Helper functions
const isValidMimeType = (mimeType) => {
  const validMimeTypes = [
    'video/mp4',
    'video/x-msvideo',
    'image/jpeg',
    'image/png',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    // Add more MIME types as needed
  ];
  return validMimeTypes.includes(mimeType);
};

const getAttachmentType = (mimeType) => {
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType === 'application/pdf') return 'document';
  if (mimeType === 'application/vnd.ms-excel') return 'document';
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
    return 'document';
  if (
    mimeType ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
    return 'document';
  if (mimeType === 'application/msword') return 'document';
  // Add more conditions as needed
  return 'other';
};

const uploadFileToBucket = async (file) => {
  if (file !== undefined) {
    const fileData = {
      Key: `new-earth/videos/${uuidv4()}-${file.filename}`,
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

const storeAttachmentFile = async (moduleName, req, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const data = await req.body.file; // Generalized to handle any file type

    if (
      !data ||
      data.type !== 'file' ||
      !isValidMimeType(data.mimetype) // Generic MIME type validation
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

    const filePath = await uploadFileToBucket(data);

    const insertData = await Model.storeProjectAttachment({
      ...req.params,
      ...req.session,
      ...req.body,
      file_path: filePath, // Store the file path
      attachment_type: getAttachmentType(data.mimetype), // Determine attachment type from MIME
      file_size: data.size, // Store the file size
      mime_type: data.mimetype, // Store the MIME type
      uploaded_at: new Date(), // Timestamp for when the file is uploaded
    });

    if (insertData && Object.keys(insertData).length > 0) {
      result = { ...result, item: insertData };
      result.message = `${moduleName} has been created successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to create ${moduleName}. Please check the payload.`;
      logger.error(
        `Unable to create ${moduleName}. Payload:: ${prettyPrintJSON(result)}`
      );
    }

    result.items = insertData;
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

const attachmentList = async (moduleName, query, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };
  try {
    let uriParams = {
      ...session,
      ...query,
    };
    uriParams = caseConversion.toCamelCase(uriParams);
    const findResult = await Model.attachmentListService(uriParams);
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

const updateAttachment = async (moduleName, req, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const data = await req.body.file;
    let filePath = null;

    if (data) {
      if (
        !data ||
        data.type !== 'file' ||
        !isValidMimeType(data.mimetype) // Generic MIME type validation
      ) {
        logger.error(
          `Unable to update ${moduleName}.
                  Error:: Invalid File Input.
                  Trace:: attachment.service.js`
        );

        result.hasError = true;
        result.message = 'Invalid file upload!';
        result.code = HTTP_STATUS.BAD_REQUEST;
        return caseConversion.toCamelCase(result);
      }
      filePath = await uploadFileToBucket(data);
    }

    const updatedData = await Model.updateProjectAttachment({
      ...req.params,
      ...req.session,
      ...req.body,
      file_path: filePath,
      attachment_type: filePath ? getAttachmentType(data.mimetype) : undefined, // Determine attachment type from MIME if file is provided
      file_size: filePath ? data.size : undefined, // Store the file size if file is provided
      mime_type: filePath ? data.mimetype : undefined, // Store the MIME type if file is provided
    });

    if (updatedData && Object.keys(updatedData).length > 0) {
      result = { ...result, item: updatedData };
      result.message = `${moduleName} has been updated successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to update ${moduleName}. Please check the payload.`;
      logger.error(
        `Unable to update ${moduleName}. Payload:: ${prettyPrintJSON(result)}`
      );
    }

    result.items = updatedData;
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

const deleteAttachment = async (moduleName, req, session, logger) => {
  let result = { hasError: false, items: { list: [], total: 0 } };

  try {
    const { id } = req.body;

    if (!id) {
      result.hasError = true;
      result.message = 'Attachment ID is required for deletion!';
      result.code = HTTP_STATUS.BAD_REQUEST;
      return caseConversion.toCamelCase(result);
    }

    const deletedData = await Model.deleteProjectAttachment(id);

    if (deletedData && deletedData.length > 0) {
      result = { ...result, item: deletedData };
      result.message = `${moduleName} has been deleted successfully`;
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.NOT_FOUND;
      result.message = `Unable to delete ${moduleName}. Please check the provided ID.`;
      logger.error(
        `Unable to delete ${moduleName}. Payload:: ${prettyPrintJSON(result)}`
      );
    }

    result.items.list = deletedData;
    result.items.total = deletedData.length;
  } catch (error) {
    logger.error(
      `Unable to delete ${moduleName}.
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
  storeAttachmentFile,
  attachmentList,
  updateAttachment,
  deleteAttachment,
};
