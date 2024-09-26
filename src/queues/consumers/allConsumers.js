const path = require('path'); // configure path
require('dotenv').config({
  path: path.join(`${__dirname}../../../../`, `.env.${process.env.NODE_ENV}`),
}); // import Env File
const rabbitMqManager = require('./rabbmitMq/rabbitMqManager');
const notificationManager = require('./pushNotification/notificationManager');
const notificationBatchManager = require('./pushNotification/notificationBatchManager');
const notificationBatchDellManager = require('./pushNotification/notificationBatchDellManager');
const { consumerLogger: logger } = require('../../utils/commonUtils/logger');

const startAllConusmers = (log) => {
  try {
    log.info('All Conusmers have been started');
    rabbitMqManager.startListening(log);
    notificationManager.startNotification(log);
    notificationBatchManager.startNotificationBatch(log);
    notificationBatchDellManager.startNotificationBatchDell(log);
  } catch (error) {
    log.error(`Error in startAllConsumers routine.
        Error:: ${error}
        Trace:: ${error.stack}`);
  }
};

startAllConusmers(logger);
