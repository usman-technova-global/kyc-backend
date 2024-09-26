const firebase = require('../../config/firebaseAdmin');
const { prettyPrintJSON } = require('../commonUtils/prettyPrintJSON');
const logger = require('../commonUtils/logger').consumerLogger;
const HTTP_STATUS = require('../constants/httpStatus');

const moduleNotificationBatchName = 'Notification Batch';

const multicastNotification = async (data) => {
  const result = { success: false };
  try {
    const failedTokens = [];
    const successTokens = [];
    const admin = await firebase.getFirebaseConnection(data.tenant);

    // console.log('admin::::::', admin);
    if (admin) {
      const notification = {
        title: data.title,
        body: data.description,
      };
      const registrationTokens = data.tokens;

      const message = {
        notification,
        tokens: registrationTokens,
        data: {
          ...notification,
          icon: '',
        },
        webpush: {
          headers: {
            Urgency: 'high',
          },
        },
      };
      const sentMsg = await admin.messaging().sendMulticast(message);
      // console.log('sentMsg.responses::::::::', sentMsg.responses);
      if (sentMsg) {
        sentMsg.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(registrationTokens[idx]);
          } else {
            successTokens.push(registrationTokens[idx]);
          }
        });

        result.success = true;
        result.hasError = false;
        result.totalFailure = sentMsg.failureCount;
        result.totalSuccess = sentMsg.successCount;
        result.failureTokens = failedTokens;
        result.successTokens = successTokens;
        result.message = `Notification has been push successfully`;
      } else {
        logger.error(`Notification failed.`);
        result.hasError = true;
        result.message = `Notification failed`;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      }
    } else {
      logger.error(`Notification connection failed.`);
      result.hasError = true;
      result.message = `Notification connection failed`;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    }
  } catch (error) {
    logger.error(
      `Unable to create ${moduleNotificationBatchName}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(data)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return result;
};
module.exports = { multicastNotification };

// const message = {
//     notification: notification,
//     "android": {
//         "notification": {
//             "sound": "default"
//         }
//     },
//     "apns": {
//         "payload": {
//             "aps": {
//                 "sound": "default"
//             }
//         }
//     },
//     tokens: registrationTokens,
//     data: {
//         ...notification,
//         icon: ''
//     },
//     "webpush": {
//         "headers": {
//             "Urgency": "high"
//         }
//     }
// }
