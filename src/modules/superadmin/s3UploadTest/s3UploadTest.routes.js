const multer = require('fastify-multer');

const upload = multer();

const uploadController = require('./s3UploaderTest.controller');

const s3UploaderRoutes = (fastify, options, done) => {
  fastify.register(multer.contentParser);

  fastify.route({
    method: 'POST',
    url: '/upload',
    schema: { hide: true },
    preHandler: upload.single('file'),
    handler: uploadController.upload,
  });
  done();
};

module.exports = s3UploaderRoutes;
