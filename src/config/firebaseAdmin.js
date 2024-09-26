const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, `.env.${process.env.NODE_ENV}`),
});
const admin = require('firebase-admin');
const { prettyPrintJSON } = require('../utils/commonUtils/prettyPrintJSON');
const logger = require('../utils/commonUtils/logger').systemLogger;

let adminConnection = null;
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};
if (!adminConnection) {
  adminConnection = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  const connectionTemp = { ...serviceAccount };
  delete connectionTemp.private_key;
  logger.error(
    `Unable to connect with Postgres database ${prettyPrintJSON(
      connectionTemp
    )}`
  );
}
const connections = new Map();
const getFirebaseConnection = async (tenant) => {
  try {
    const connection = connections.get(tenant);
    if (connection) {
      return connection;
    }

    const tenantServiceAccount = {
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
    };

    if (!adminConnection) {
      const newConnection = admin.initializeApp({
        credential: admin.credential.cert(tenantServiceAccount),
      });
      connection.set(tenant, newConnection);
      return newConnection;
    }
    return adminConnection;
  } catch (error) {
    // console.error('Error initializing Firebase:', error);
    return error;
  }
};

module.exports = { adminConnection, getFirebaseConnection };
