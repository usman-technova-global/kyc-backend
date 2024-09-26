/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
console.clear();
process.env.TZ = 'UTC';
const fastify = require('fastify');
const fastifyCors = require('@fastify/cors');
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUI = require('@fastify/swagger-ui');
const fastifyFormBody = require('@fastify/formbody');
const fastifyMultipart = require('@fastify/multipart');
const path = require('path'); // configure path

require('dotenv').config({
  path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
}); // import Env File
require('./cronJob');
const routes = require('./src/routes/all.routes'); // import routes
const logger = require('./src/utils/commonUtils/logger').systemLogger;
const { apiSuccessResponse } = require('./src/utils/commonUtil');

// eslint-disable-next-line no-unused-vars
// const perFormAllTests = require('./src/tests/allTest');

logger.info('perFormAllTests has been started');

//  require Fastify
function ajvFilePlugin(ajv) {
  return ajv.addKeyword({
    keyword: 'isFile',
    compile: (_schema, parent) => {
      parent.type = 'file';
      delete parent.isFile;
      return () => true;
    },
  });
}

const server = fastify({
  logger: false,
  ajv: {
    plugins: [ajvFilePlugin],
  },
});

server.register(fastifyFormBody);
server.register(fastifyMultipart, {
  attachFieldsToBody: 'keyValues',
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  async onFile(part) {
    const buffer = await part.toBuffer();
    // console.log('buffer', buffer);
    part.value = {
      type: part.type,
      fieldname: part.fieldname,
      filename: part.filename,
      encoding: part.encoding,
      mimetype: part.mimetype,
      buffer,
      size: buffer.length,
    };
  },
});

// Swagger Implementation
server.register(fastifySwagger, {});
server.register(fastifySwaggerUI, {
  routePrefix: '/kyc/docs',
  swagger: {
    info: {
      title: 'My FirstAPP Documentation',
      description: 'My FirstApp Backend Documentation description',
      version: '1.1.0',
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header',
      },
    },
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [{ name: 'User', description: "User's API" }],
  },
  uiConfig: {
    docExpansion: 'list', // expand/not all the documentations none|list|full
    deepLinking: true,
  },
  uiHooks: {
    onRequest(request, reply, next) {
      next();
    },
    preHandler(request, reply, next) {
      next();
    },
  },
  staticCSP: false,
  transformStaticCSP: (header) => header,
  exposeRoute: true,
});

//  API Cors
server.register(fastifyCors, {
  origin: '*',
});

//  register all routes file with prefix
server.register(routes, { prefix: `/kyc${process.env.WEB_SERVER_BASEPATH}` });

// checking for server is up or not
server.get('/kyc', (req, res) =>
  res.code(200).send(apiSuccessResponse('Server is running now.'))
);

// creating server
const startFastifyService = async () => {
  try {
    if (process.env.WEB_SERVER_PORT && process.env.WEB_SERVER_HOST) {
      await server.listen({
        port: process.env.WEB_SERVER_PORT,
        host: process.env.WEB_SERVER_HOST,
      });
      logger.info(
        `server is running on ${process.env.WEB_SERVER_HOST} : ${process.env.WEB_SERVER_PORT}`
      );
    } else {
      logger.error(
        `Please check WEB_SERVER_PORT and WEB_SERVER_HOST env variables, are not defined.
        There values are:: ${process.env.WEB_SERVER_HOST} : ${process.env.WEB_SERVER_PORT}`
      );
    }
  } catch (error) {
    logger.error(`Error:: ${error}
    Trace:: ${error.stack}`);
    server.log.error(error);
    process.exit(1);
  }
};

//* Fastify service
startFastifyService();
server.ready((err) => {
  if (err) throw err;
  server.swagger();
});
