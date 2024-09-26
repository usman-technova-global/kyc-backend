const amqp = require('amqplib');
const logger = require('../commonUtils/logger').consumerLogger;

let connection = null;

// const getConection = async () => {
//   try {
//     if (!connection) {
//       connection = await amqp.connect(process.env.RABBITMQ_HOST);
//     }
//     return connection;
//   } catch (error) {
//     logger.error(`Error in getChannelLocal::: ${error}`);
//     connection = null;
//     return null;
//   }
// };

const topics = [];

const getChannelLocal = async (topic) => {
  // connection = await getConection();
  let channel = null;
  try {
    if (topics.includes(topic)) {
      channel = await channel.assertQueue(topic, { durable: true });
      topics.push(topic);
    }
    if (!topics.includes(topic)) {
      connection = await amqp.connect(process.env.RABBITMQ_HOST);
      channel = await connection.createChannel();
      process.once('SIGINT', async () => {
        await channel.close();
        await connection.close();
        logger.info(`RabbitQM connection has been closed.`);
      });
    }
  } catch (err) {
    logger.error(`Error in getChannelLocal::: ${err}`);
  }
  return channel;
};

const sendToQueue = async (topicWithOutEnv, message) => {
  // console.log('topicWithOutEnv:::::', topicWithOutEnv);
  const topic = `${process.env.NODE_ENV}_${topicWithOutEnv}`;
  const localChannel = await getChannelLocal(topic);
  // console.log('localChannel::::::::', localChannel);
  localChannel.sendToQueue(topic, Buffer.from(JSON.stringify(message)));
};

const listenToQueue = async (topicWithOutEnv) => {
  const topic = `${process.env.NODE_ENV}_${topicWithOutEnv}`;
  const localChannel = await getChannelLocal(topic);
  return localChannel;
};

const getQueueName = (topicWithOutEnv) =>
  `${process.env.NODE_ENV}_${topicWithOutEnv}`;

module.exports = { sendToQueue, listenToQueue, getQueueName };
