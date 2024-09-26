const HTTP_STATUS = require('../../../../utils/constants/httpStatus');
const knex = require('../../../../config/databaseConnection');
const MODULE = require('../../../../utils/constants/moduleNames');

const storeProjectAttachment = async (data) => {
  if (Object.keys(data).length) {
    const newData = {
      file_path: data.file_path,
      project_id: data.projectId,
      tenant: data.tenant,
      title: data.title,
      day: data.day,
      category: data.category,
      description: data.description,
      attachment_type: data.attachment_type,
      file_size: data.file_size,
      mime_type: data.mime_type,
      uploaded_at: data.uploaded_at,
      status: data.status || 'active', // Default status to 'active'
      is_deleted: false, // Default to not deleted
    };

    const attachmentCreate = await knex(MODULE.NEW_EARTH.PROJECT_ATTACHMENT)
      .insert(newData)
      .returning('*');

    if (!attachmentCreate.length) {
      const newError = new Error('No Project Attachment');
      newError.detail = 'Project attachment creation failed';
      newError.code = HTTP_STATUS.BAD_REQUEST;
      throw newError;
    }

    // Join the inserted data with the project table to include name and start_date
    const enrichedAttachmentCreate = await knex(
      `${MODULE.NEW_EARTH.PROJECT_ATTACHMENT} as pa`
    )
      .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pa.project_id', 'p.id')
      .where(
        'pa.id',
        'in',
        attachmentCreate.map((v) => v.id)
      )
      .select(
        'pa.*',
        'p.name as project_name',
        'p.start_date as project_start_date'
      )
      .first();

    return enrichedAttachmentCreate;
  }

  const newError = new Error('No Project Attachments');
  newError.detail = 'Project Attachment service did not execute';
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

const attachmentListService = async (param) => {
  // Start building the query
  const query = knex
    .from(`${MODULE.NEW_EARTH.PROJECT_ATTACHMENT} as pa`)
    .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pa.project_id', 'p.id')
    .whereRaw('pa.tenant = ?', [param.tenant])
    .whereRaw('pa.is_deleted = ?', [false]);

  // Add optional projectId criteria
  if (param.projectId) {
    query.andWhere((queryBuilder) => {
      queryBuilder.whereRaw('pa.project_id = ?', [param.projectId]);
    });
  }
  // Add optional search criteria
  if (param.search) {
    query.andWhere((queryBuilder) => {
      queryBuilder
        .whereRaw('pa.title ILIKE ?', [`%${param.search}%`])
        .orWhereRaw('pa.description ILIKE ?', [`%${param.search}%`])
        .orWhereRaw('pa.day ILIKE ?', [`%${param.search}%`]);
    });
  }

  // Add filter by attachment type if provided
  if (param.type) {
    query.andWhere('pa.attachment_type', param.type);
  }

  // Clone the query to get the total count
  const totalQuery = query.clone().count();

  // Apply pagination and select required columns
  const paginatedQuery = query
    .clone()
    .select(
      'pa.*',
      'p.name as project_name',
      'p.start_date as project_start_date'
    )
    .limit(param.size)
    .offset(param.page * param.size);

  // Execute the queries
  const [totalResult, paginatedResult] = await Promise.all([
    totalQuery,
    paginatedQuery,
  ]);

  // Extract the total count from the result
  const total = totalResult[0].count || 0;

  return {
    totalList: paginatedResult,
    total: parseInt(total, 10),
  };
};

const updateProjectAttachment = async (data) => {
  if (Object.keys(data).length) {
    // Extract the fields to be updated from the data object
    const updateFields = {};
    if (data.file_path) updateFields.file_path = data.file_path;
    if (data.projectId) updateFields.project_id = data.projectId;
    if (data.tenant) updateFields.tenant = data.tenant;
    if (data.title) updateFields.title = data.title;
    if (data.day) updateFields.day = data.day;
    if (data.category) updateFields.category = data.category;
    if (data.description) updateFields.description = data.description;
    if (data.attachment_type)
      updateFields.attachment_type = data.attachment_type;
    if (data.file_size) updateFields.file_size = data.file_size;
    if (data.mime_type) updateFields.mime_type = data.mime_type;
    if (data.status) updateFields.status = data.status;

    // Update the project attachment
    const updatedRows = await knex(MODULE.NEW_EARTH.PROJECT_ATTACHMENT)
      .where('id', data.id)
      .update(updateFields)
      .returning('*');

    if (!updatedRows.length) {
      const newError = new Error('No Project Attachment found');
      newError.detail =
        'The specified Project Attachment was not found or updated';
      newError.code = HTTP_STATUS.NOT_FOUND;
      throw newError;
    }

    // Join the updated data with the project table to include name and start_date
    const enrichedAttachment = await knex(
      `${MODULE.NEW_EARTH.PROJECT_ATTACHMENT} as pa`
    )
      .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pa.project_id', 'p.id')
      .where('pa.id', updatedRows[0].id) // Assuming we want to get details of the single updated row
      .select(
        'pa.*',
        'p.name as project_name',
        'p.start_date as project_start_date'
      )
      .first();

    return enrichedAttachment;
  }

  const newError = new Error('No data provided');
  newError.detail = 'No data was provided for updating';
  newError.code = HTTP_STATUS.BAD_REQUEST;
  throw newError;
};

const deleteProjectAttachment = async (id) => {
  if (!id) {
    const newError = new Error('No ID provided');
    newError.detail = 'No ID was provided for deletion';
    newError.code = HTTP_STATUS.BAD_REQUEST;
    throw newError;
  }

  // Soft delete: Update the `is_deleted` flag
  const deletedRows = await knex(MODULE.NEW_EARTH.PROJECT_ATTACHMENT)
    .where('id', id)
    .update({ is_deleted: true, status: 'deleted', deleted_at: knex.fn.now() })
    .returning('*');

  if (!deletedRows.length) {
    const newError = new Error('No Project Attachment found');
    newError.detail =
      'The specified Project Attachment was not found or deleted';
    newError.code = HTTP_STATUS.NOT_FOUND;
    throw newError;
  }

  // Join the deleted data with the project table to include name and start_date
  const enrichedDeletedAttachment = await knex(
    `${MODULE.NEW_EARTH.PROJECT_ATTACHMENT} as pa`
  )
    .join(`${MODULE.NEW_EARTH.PROJECTS} as p`, 'pa.project_id', 'p.id')
    .where('pa.id', deletedRows[0].id) // Assuming we want to get details of the single deleted row
    .select(
      'pa.*',
      'p.name as project_name',
      'p.start_date as project_start_date'
    );

  return enrichedDeletedAttachment;
};

module.exports = {
  storeProjectAttachment,
  attachmentListService,
  updateProjectAttachment,
  deleteProjectAttachment,
};
