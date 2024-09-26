const buildLogger = require('../../config/buildLogger');
const LOGGER = require('../constants/loggerConstants');

const loggers = new Map();

loggers.set(LOGGER.ADMIN, buildLogger(LOGGER.ADMIN));
loggers.set(LOGGER.APP, buildLogger(LOGGER.APP));
loggers.set(LOGGER.AUDIT, buildLogger(LOGGER.AUDIT));
loggers.set(LOGGER.SYSTEM, buildLogger(LOGGER.SYSTEM));
loggers.set(LOGGER.CONSUMER, buildLogger(LOGGER.CONSUMER));

const adminLogger = loggers.get(LOGGER.ADMIN);
const appLogger = loggers.get(LOGGER.APP);
const auditLogger = loggers.get(LOGGER.AUDIT);
const systemLogger = loggers.get(LOGGER.SYSTEM);
const consumerLogger = loggers.get(LOGGER.CONSUMER);

module.exports = {
  systemLogger,
  adminLogger,
  appLogger,
  auditLogger,
  consumerLogger,
};
