const { assert } = require('console');
const redisClient = require('../config/redisClient');

const tenantId = '619943ef-8e9f-4a74-9e1e-4b299d19330d';

const performTest = async () => {
  await redisClient.setValue(tenantId, 'TEST_VALUE_KEY', 'TEST VALUE DATA');
  const getValueTest = await redisClient.getValue(tenantId, 'TEST_VALUE_KEY');
  assert(getValueTest === 'TEST VALUE DATA');

  await redisClient.setValueWithExpiry(
    tenantId,
    'TEST_VALUE_KEY_EXPIRY',
    100,
    'TEST VALUE EXPIRY DATA'
  );
  const getValueTestExpiry = await redisClient.getValue(
    tenantId,
    'TEST_VALUE_KEY_EXPIRY'
  );
  assert(
    getValueTestExpiry === 'TEST VALUE EXPIRY DATA',
    'Redis setValueWithExpiry has been failed'
  );

  await redisClient.setDictionaryValue(
    tenantId,
    'TEST_DICTIONARY_VALUE',
    'ITEM_KEY_1',
    'TEST DICTIONARY DATA'
  );
  const getDictionaryValueTest = await redisClient.getDictionaryValue(
    tenantId,
    'TEST_DICTIONARY_VALUE',
    'ITEM_KEY_1'
  );
  assert(
    getDictionaryValueTest === 'TEST DICTIONARY DATA',
    'Redis setDictionaryValue has been failed'
  );
};

performTest();
