const nodemailer = require('nodemailer');
//const sendGridTransport = require('nodemailer-sendgrid-transport');
const {
  generateNewPhraseEmail,
  generateOTPEmail,
} = require('../utils/commonUtils/generateEmail');
const { google } = require('googleapis');


// OAuth2 setup
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET_ID,
  process.env.MAIL_REDIRECT_URL // Redirect URL
);

// Set the refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.MAIL_REFRESH_TOKEN,// Your refresh token
});
// const transporter = nodemailer.createTransport(
//   sendGridTransport({
//     auth: {
//       api_key: process.env.SENDGRID_API_KEY,
//     },
//   })
// );

async function sendSignUpMail(email, otp) {

  const accessToken = await oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    type: process.env.MAIL_AUTH_TYPE,
    user: process.env.MAIL_AUTH_USER,
    clientId: process.env.MAIL_CLIENT_ID,
    clientSecret: process.env.MAIL_CLIENT_SECRET_ID,
    refreshToken: process.env.MAIL_REFRESH_TOKEN,
    accessToken: accessToken.token,
  },
});

  const data = {
    heading: 'confirm your email address',
    message: `your confirmation code is below - enter it in and we'll help you get registered.`,
    code: otp,
    expirationMessage: 'this code will expire in 1 hour.',
  };
  return transporter.sendMail({
    to: email,
    from: process.env.SENDGRID_MAIL_FROM,
    subject: 'Your OTP Verification Code',
    html: generateOTPEmail(data),
  });
}

async function sendPasswordRecoveryMailForDriver(email, otp) {
  const data = {
    heading: 'reset your password',
    message: `your confirmation code is below - enter it in and we'll help you reset your password.`,
    code: otp,
    expirationMessage: 'this code will expire in 1 hour.',
  };
  return transporter.sendMail({
    to: email,
    from: process.env.SENDGRID_MAIL_FROM,
    subject: 'Your Password Recovery OTP',
    html: generateOTPEmail(data),
  });
}

async function sendToMailNewPhrase(subject, email, obj) {
  return transporter.sendMail({
    to: email,
    from: process.env.SENDGRID_MAIL_FROM,
    subject,
    html: generateNewPhraseEmail(obj),
  });
}

module.exports = {
  sendSignUpMail,
  sendPasswordRecoveryMailForDriver,
  // Same Implementation For Now Will Change If User And Driver Has Different Flow
  sendPasswordRecoveryMailForApp: sendPasswordRecoveryMailForDriver,
  sendToMailNewPhrase,
};
