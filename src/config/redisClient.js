const Redis = require('ioredis');
const { prettyPrintJSON } = require('../utils/commonUtils/prettyPrintJSON');
const logger = require('../utils/commonUtils/logger').systemLogger;

let client;
const createRedisClient = async () => {
  if (!client) {
    if (process.env.REDIS_CLIENT_PORT && process.env.REDIS_CLIENT_HOST) {
      client = new Redis(
        process.env.REDIS_CLIENT_PORT,
        process.env.REDIS_CLIENT_HOST
      );
    } else {
      logger.error('Host or port of redis is not defined');
      throw new Error('Host or port of redis is not defined');
    }
  }
  return client;
};

const setValue = async (tenantId, key, value) => {
  const clientConnection = await createRedisClient();
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${key}`;
  await clientConnection.set(newKey, value, (error) => {
    if (error) {
      logger.error("(setValue) Can't set Value in Redis", error);
    }
  });
};

const setValueWithExpiry = async (tenantId, key, timeInSeconds, value) => {
  const clientConnection = await createRedisClient();
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${key}`;
  await clientConnection.set(newKey, value, 'EX', timeInSeconds, (error) => {
    if (error) {
      logger.error("(setValueWithExpiry) Can't set Value in Redis", error);
    }
  });
};

const getValue = async (tenantId, key) => {
  const clientConnection = await createRedisClient();
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${key}`;
  const values = await clientConnection.get(newKey, (error) => {
    if (error) {
      logger.error("(getValue) Can't get Value from Redis", error);
    }
  });
  return values;
};

const getTTL = async (tenantId, key) => {
  const clientConnection = await createRedisClient();
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${key}`;
  const values = await clientConnection.ttl(newKey, (error) => {
    if (error) {
      logger.error("(getTTL) Can't get ttl Value from Redis", error);
    }
  });
  return values;
};

const removeValue = async (tenantId, key) => {
  const clientConnection = await createRedisClient();
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${key}`;
  await clientConnection.set(newKey, null, 'EX', 1, (error) => {
    if (error) {
      logger.error("(removeValue) Can't remove Value from Redis", error);
    }
  });
};

const getDictionaryValue = async (tenantId, mapKey, key) => {
  const clientConnection = await createRedisClient();
  let result;
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${mapKey}`;
  try {
    result = await clientConnection.hget(newKey, key.toString());
  } catch (error) {
    logger.error(
      `(getDictionaryValue) Can't get Value from Redis for map: ${mapKey}
      Key:: ${prettyPrintJSON(key)}
      Error:: ${error}`
    );
  }
  return result;
};

const setDictionaryValue = async (tenantId, mapKey, key, value) => {
  const clientConnection = await createRedisClient();
  let result;
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${mapKey}`;
  try {
    result = await clientConnection.hset(newKey, key.toString(), value);
  } catch (error) {
    logger.error(
      `(setDictionaryValue) Can't set Value to Redis for map:${mapKey}
      Key:: ${prettyPrintJSON(key)}
      Error:: ${error} 
      Value:: ${prettyPrintJSON(value)}`
    );
  }
  return result;
};

const getDictionary = async (tenantId, key) => {
  const clientConnection = await createRedisClient();
  let result;
  const newKey = `${process.env.NODE_ENV}:${tenantId}:${key}`;
  try {
    result = await clientConnection.hgetall(newKey);
  } catch (error) {
    logger.error(
      `(getDictionary) Error in calling hgetall method
      Key:: ${prettyPrintJSON(key)}
      Error:: ${error}`
    );
  }
  return result;
};

module.exports = {
  setValue,
  setValueWithExpiry,
  getValue,
  removeValue,
  setDictionaryValue,
  getDictionaryValue,
  getDictionary,
  getTTL,
};
