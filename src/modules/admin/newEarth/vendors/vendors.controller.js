const logger = require('../../../../utils/commonUtils/logger').adminLogger;

const handleRequest = require('../../../../utils/commonUtils/handleRequestUtil');
const Service = require('./vendors.service');

const moduleName = 'Vendors';

const store = (req, res) => {
  handleRequest(
    async (request, response) =>
      Service.create(moduleName, request, response, logger),
    req,
    res,
    moduleName,
    logger
  );
};

const List = (req, res) => {
  handleRequest(
    async (request, response) =>
      Service.fetchVendors(moduleName, request, response, logger),
    req,
    res,
    moduleName,
    logger
  );
};

const Lov = (req, res) => {
  handleRequest(
    async (request, response) =>
      Service.fetchVendorsLov(moduleName, request, response, logger),
    req,
    res,
    moduleName,
    logger
  );
};

const find = (req, res) => {
  handleRequest(
    async (request, response) =>
      Service.find(moduleName, request, response, logger),
    req,
    res,
    moduleName,
    logger
  );
};

const update = (req, res) => {
  handleRequest(
    async (request, response) =>
      Service.update(moduleName, request, response, logger),
    req,
    res,
    moduleName,
    logger
  );
};

const deleteVendor = (req, res) => {
  handleRequest(
    async (request, response) =>
      Service.remove(moduleName, request, response, logger),
    req,
    res,
    moduleName,
    logger
  );
};

module.exports = {
  store,
  List,
  update,
  deleteVendor,
  find,
  Lov,
};
