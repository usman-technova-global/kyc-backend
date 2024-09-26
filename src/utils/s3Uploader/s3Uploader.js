const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_ID,
  secretAccessKey: process.env.S3_ACCESS_KEY,
  region: process.env.S3_REGION,
});

const uploadToAdminBucket = (params) => {
  // const data = { ...params, Bucket: process.env.S3_BUCKET, ACL: 'public-read' }; // ACL is not supported on the bucket.
  const data = { ...params, Bucket: process.env.S3_BUCKET , ACL: 'public-read' };
  return s3.upload(data).promise();
};



module.exports = { uploadToAdminBucket };
