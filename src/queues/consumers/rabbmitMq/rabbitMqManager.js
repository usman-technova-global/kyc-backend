const { NOTIFICATION } = require('../../../utils/constants/queseConstants');
const {
  listenToQueue,
  getQueueName,
} = require('../../../utils/queues/rabbmitMqConnection');

const startListening = async (log) => {
  log.info('RabbtiMQ consumer has been started');
  try {
    const channel = await listenToQueue(NOTIFICATION);
    await channel.consume(
      getQueueName(NOTIFICATION),
      (message) => {
        // console.log('NOTIFICATION', NOTIFICATION);
        if (message) {
          log.debug(JSON.parse(message.content.toString()));
        }
      },
      { noAck: true }
    );
  } catch (err) {
    log.error(`Error in rabbitMqConsumer:: ${err}`);
  }
};

module.exports = { startListening };
