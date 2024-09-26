const knex = require('knex');
const logger = require('../utils/commonUtils/logger').systemLogger;
const { prettyPrintJSON } = require('../utils/commonUtils/prettyPrintJSON');

/**
 * This variable stores a knexConnection.
 * @type {knex.Knex | null}
 */
let knexConnection = null;
const connection = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  // ssl: {
  //   rejectUnauthorized: true,
  // },
  debug: true, // Enable debug mode to see SQL queries and connection info
};
if (!knexConnection) {
  knexConnection = knex({
    client: 'pg',
    version: '7.2',
    connection,
    pool: { min: 0, max: 7 },
  });
} else {
  const connectionTemp = { ...connection };
  delete connectionTemp.password;
  logger.error(
    `Unable to connect with Postgres database ${prettyPrintJSON(
      connectionTemp
    )}`
  );
}

// Test the connection
knexConnection
  .raw('SELECT 1')
  .then(() => {
    logger.info('Successfully connected to Postgres database.');
  })
  .catch((error) => {
    logger.error('Error during Postgres database connection:', error);
  });
/*
Enable this code block if you want to use ORM
const { Sequelize } = require('sequelize');
let sequelize = null;
if(!sequelize)
{
    try
    {
      sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
        host: process.env.DBHOST,
        dialect: process.env.DIALECT  // one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle'
      });
      sequelize.authenticate();
      // console.log('Connection has been established successfully.');
    }
    catch (error)
    {
      // console.error('Unable to connect to the database:', error);
    }
}
module.exports = sequelize;
*/
module.exports = knexConnection;
