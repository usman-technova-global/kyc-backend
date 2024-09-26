const Model = require('./email.model');
const caseConversion = require('../../utils/commonUtils/caseConversion');
const { sendToMailNewPhrase } = require('../../config/nodeMailer');
const { hashAsync } = require('../../utils/security/bcrypt');
const HTTP_STATUS = require('../../utils/constants/httpStatus');

const newPhraseEmail = async (moduleName, id, logger) => {
  let result = { hasError: false };
  try {
    const findResult = await Model.findUserById(id, logger);
    if (findResult && Object.keys(findResult).length > 0) {
      if (findResult.send_to_email && id === findResult.id) {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Email already send, please contact to administrator.`;
        return caseConversion.toCamelCase(result);
      }
      const emailCode = await hashAsync(findResult.email);
      if (emailCode) {
        const subject = 'Change your password';
        const link = `${process.env.SEND_TO_MAIL_REDIRECT_LINK}?code=${emailCode}`;
        const obj = {
          heading: 'Change your password',
          message:
            'That’s okay, it happens! Click on the button<br />below to reset your password',
          link,
          logo: 'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/app/images/5153096c-8345-4c50-86c6-91e87f3cd399-Asset%201%404x%201.png',
          headerImage:
            'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/app/images/6af9f5ac-fe86-4323-9519-de8bb53541ee-Key.png',
        };
        const sentMessageInfo = await sendToMailNewPhrase(
          subject,
          findResult.email,
          obj
        );

        // const sentMessageInfo = await sendToMailNewPhrase(
        //   subject,
        //   'taqi@urapptech.com',
        //   obj
        // );

        if (sentMessageInfo && sentMessageInfo.message === 'success') {
          const updateCode = await Model.updateUserById(id, {
            send_to_email: true,
            code: emailCode,
          });
          if (updateCode) {
            result.hasError = false;
            result.code = HTTP_STATUS.OK;
            result = { ...result, item: {} };
            result.message = `User ${moduleName} has been sent successfully.`;
          } else {
            result.hasError = true;
            result.code = HTTP_STATUS.NOT_FOUND;
            result.message = `User does not sent email.`;
            logger.error(`User does not generate email.`);
          }
        } else {
          result.hasError = true;
          result.code = HTTP_STATUS.NOT_FOUND;
          result.message = `User does not sent email.`;
          logger.error(`User does not sent email.`);
        }
      }
    }
  } catch (error) {
    logger.error(
      `User does not sent email.
      Id:: ${id}.
      Error:: ${error}
      Trace:: ${error.stack}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }
  return caseConversion.toCamelCase(result);
};

const newEmail = async (moduleName, id) => {
  let msg;
  const findResult = await Model.findUserById(id);
  if (findResult && Object.keys(findResult).length > 0) {
    const emailCode = await hashAsync(findResult.email);
    if (emailCode) {
      const subject = 'Change your password';
      // const link = process.env.SEND_TO_MAIL_REDIRECT_LINK + "?code=" + emailCode;
      const link = new URL(process.env.SEND_TO_MAIL_REDIRECT_LINK);
      link.searchParams.append('code', emailCode);
      const obj = {
        heading: 'Change your password',
        message:
          'That’s okay, it happens! Click on the button<br />below to reset your password',
        link: link.toString(),
        logo: 'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/app/images/5153096c-8345-4c50-86c6-91e87f3cd399-Asset%201%404x%201.png',
        headerImage:
          'https://lundry-app-admin.s3.ca-central-1.amazonaws.com/app/images/6af9f5ac-fe86-4323-9519-de8bb53541ee-Key.png',
      };
      const sentMessageInfo = await sendToMailNewPhrase(
        subject,
        findResult.email,
        obj
      );

      // const sentMessageInfo = await sendToMailNewPhrase(
      //   subject,
      //   'taqi@urapptech.com',
      //   obj
      // );

      if (sentMessageInfo && sentMessageInfo.message === 'success') {
        const updateCode = await Model.updateUserById(id, {
          send_to_email: true,
          code: emailCode,
        });
        if (updateCode) {
          msg = `User ${moduleName} has been sent successfully.`;
        } else {
          msg = `User does not sent email.`;
        }
      } else {
        msg = `User does not sent email.`;
      }
    }
  }
  return msg;
};

module.exports = {
  newPhraseEmail,
  newEmail,
};
