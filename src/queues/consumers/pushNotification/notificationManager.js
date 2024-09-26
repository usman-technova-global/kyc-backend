const {
  PUSH_NOTIFICATION,
} = require('../../../utils/constants/queseConstants');
const {
  listenToQueue,
  getQueueName,
} = require('../../../utils/queues/rabbmitMqConnection');
const notificationService = require('./notificationService');

const startNotification = async (log) => {
  log.info('RabbtiMQ consumer has been started');
  try {
    const channel = await listenToQueue(PUSH_NOTIFICATION);
    // console.log('channel::::::', channel);
    await channel.consume(
      getQueueName(PUSH_NOTIFICATION),
      async (message) => {
        // console.log('PUSH_NOTIFICATION', PUSH_NOTIFICATION);
        if (message) {
          log.info('Create notification has been started');
          // log.debug(JSON.parse(message.content.toString()));
          const notification = await notificationService.createNotification(
            JSON.parse(message.content.toString()),
            log
          );
          // console.log('notification Manager:::::::::', notification);
          if (notification && !notification.hasError) {
            notificationService.notificationBatch(
              notification.notification[0],
              log
            );
          }
        }
      },
      { noAck: true }
    );
  } catch (err) {
    log.error(`Error in rabbitMqConusmer:: ${err}`);
  }
};

module.exports = { startNotification };
