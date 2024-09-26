const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const appCustomerModel = require('./appCustomer.model');
const { hashAsync, isVerifyAsync } = require('../../../utils/security/bcrypt');
const OTP = require('../../../utils/security/otp');
const uploader = require('../../../utils/s3Uploader/s3Uploader');

const {
  sendSignUpMail,
  sendPasswordRecoveryMailForDriver,
  sendPasswordRecoveryMailForApp,
} = require('../../../config/nodeMailer');
const {
  toCamelCase,
  toSnakeCase,
} = require('../../../utils/commonUtils/caseConversion');
const {
  generateAccessToken,
  // generateRefreshToken,
} = require('../../../utils/security/oauth');
const {
  prettyPrintJSON,
} = require('../../../utils/commonUtils/prettyPrintJSON');
const { promiseHandler } = require('../../../utils/commonUtils/promiseHandler');
const HTTP_STATUS = require('../../../utils/constants/httpStatus');
const enumConstants = require("./../../../utils/constants/enumConstants")

const createCustomer = async (customerData) => {
  let newCustomerData = customerData;
  let appCustomer = { hasError: false };
  try {
    newCustomerData.id = uuidv4();
    newCustomerData.is_active = true;
    newCustomerData.status = enumConstants.CUSTOMER_STATUS.VERIFIED;

    const docFront = newCustomerData.doc_front;
    const docBack = newCustomerData.doc_back;
    const faceImage = newCustomerData.image;

  const findCustomer = await appCustomerModel.findByIdNoAndStatus(newCustomerData.id_no, newCustomerData.status)
   if(findCustomer){
    appCustomer.hasError = true;
    appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
    appCustomer.message = `Customer ID No is already exist.`;
    logger.error(`Customer ID No is already exist.`);
    return toCamelCase(appCustomer);
   }

   //images upload
   if(docFront ){
    const docFrontImg = await uploadImageDoc(newCustomerData.doc_front );
    delete newCustomerData.doc_front;
    newCustomerData.doc_front = docFrontImg.Location;
  
  }else{
    newCustomerData.doc_front = null;
  }
  
  if(docBack){
    const docBackImg = await uploadImageDoc(newCustomerData.doc_back );
    delete newCustomerData.doc_back;
    newCustomerData.doc_back = docBackImg.Location;
  
  
  }else{
    newCustomerData.doc_back = null;
  
  }
  
  if(faceImage){
    const faceImageImg = await uploadImageDoc(newCustomerData.image );
    delete newCustomerData.image;
    newCustomerData.image = faceImageImg.Location;
  
  }else{
    newCustomerData.image = null;
  
  }  
    //End images upload
    const customerResult = await appCustomerModel.createCustomer(newCustomerData);
    if (customerResult && customerResult.rowCount > 0) {
      appCustomer = { ...appCustomer, customer: newCustomerData };
      appCustomer.message = `Your customer has been created successfully.`;
    } else {
      appCustomer.hasError = true;
      appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCustomer.message = `Unable to create your Customer, please check the payload.`;
      logger.error(
        `Unable to create ${MODULE.CUSTOMER}.
        Payload:: `
      );
    }
  } catch (error) {
    logger.error(
      `Unable to create ${MODULE.CUSTOMER}.
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: `
    );
    appCustomer.hasError = true;
    appCustomer.message = error.detail;
    appCustomer.code = error.code;
    
  }
  return toCamelCase(appCustomer);
};


// const uploadImageDoc = async (file, newBody)=>{
  
 
//   if (file) {
//     const fileData = {
//       Key: `docs/${uuidv4()}-${file.filename}`,
//       Body: file.buffer,
//       'Content-Type': file.mimetype,
//     };
//     const img = await uploader.uploadToAdminBucket(fileData);
//     newBody.avatar = img.Location;
//   } else {
//     newBody.avatar = null;
//   }
// }

const uploadImageDoc = async (file)=>{
  const fileData = {
    Key: `docs/${uuidv4()}-${file.filename}`,
    Body: file.buffer,
    'Content-Type': file.mimetype,
  };
  const img = await uploader.uploadToAdminBucket(fileData);
return img;
}

module.exports = {
  createCustomer
};
