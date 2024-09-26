const {
  PUSH_NOTIFICATION_BATCH_DELL,
} = require('../../../utils/constants/queseConstants');
const {
  listenToQueue,
  getQueueName,
} = require('../../../utils/queues/rabbmitMqConnection');
const notificationService = require('./notificationService');

const startNotificationBatchDell = async (log) => {
  log.info('RabbtiMQ consumer has been started');
  try {
    const channel = await listenToQueue(PUSH_NOTIFICATION_BATCH_DELL);
    await channel.consume(
      getQueueName(PUSH_NOTIFICATION_BATCH_DELL),
      async (message) => {
        // console.log(
        //   'JSON.parse(message.content.toString())',
        //   JSON.parse(message.content.toString())
        // );
        if (message) {
          log.info('Create notification deleted batches has been started');
          // log.debug(JSON.parse(message.content.toString()));
          notificationService.notificationSent(
            JSON.parse(message.content.toString()),
            log
          );
        }
      },
      { noAck: true }
    );
  } catch (error) {
    log.error(`Error in rabbitMqConsumer.
    Error:: ${error}
    Trace:: ${error.stack}`);
  }
};

module.exports = { startNotificationBatchDell };
