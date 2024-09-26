const {
  PUSH_NOTIFICATION_BATCH,
} = require('../../../utils/constants/queseConstants');
const {
  listenToQueue,
  getQueueName,
} = require('../../../utils/queues/rabbmitMqConnection');
const notificationService = require('./notificationService');

const startNotificationBatch = async (log) => {
  log.info('RabbtiMQ bach consumer has been started');
  try {
    const channel = await listenToQueue(PUSH_NOTIFICATION_BATCH);
    await channel.consume(
      getQueueName(PUSH_NOTIFICATION_BATCH),
      async (message) => {
        // console.log('PUSH_NOTIFICATION_BATCH', PUSH_NOTIFICATION_BATCH);
        if (message) {
          log.info('Create notification batches has been started');
          // log.debug(JSON.parse(message.content.toString()));
          notificationService.notificationSent(
            JSON.parse(message.content.toString()),
            log
          );
        }
      },
      { noAck: true }
    );
  } catch (err) {
    log.error(`Error in rabbitMqConusmer:: ${err}`);
  }
};

module.exports = { startNotificationBatch };
