const caseConvertor = require('json-case-convertor');

const toObject = (object) => JSON.parse(JSON.stringify(object));

const toSnakeCase = (object) => caseConvertor.snakeCaseKeys(toObject(object));

const toCamelCase = (object) => caseConvertor.camelCaseKeys(toObject(object));

const toLowerCase = (string) => caseConvertor.lowerCaseValues(string);

const toKebabCase = (string) => caseConvertor.kebabCaseValues(string);

module.exports = {
  toSnakeCase,
  toCamelCase,
  toLowerCase,
  toKebabCase,
  toObject,
};
