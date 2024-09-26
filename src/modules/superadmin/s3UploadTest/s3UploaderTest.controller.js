const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const uploader = require('../../../utils/s3Uploader/s3Uploader');

const upload = async (req, res) => {
  const params = {
    Key: `menu/${req.file.filename}`,
    Body: req.file.buffer,
    'Content-Type': req.file.mimetype,
  };
  const result = await uploader.uploadToAdminBucket(params);
  if (result)
    res.send({
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: result,
      message: 'File uploaded successfully!',
    });
};

module.exports = { upload };
