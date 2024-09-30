const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const MODULE = require('../../../utils/constants/moduleNames');
const { appLogger: logger } = require('../../../utils/commonUtils/logger');
const  dateUtil  = require('../../../utils/commonUtils/date');
const appCustomerModel = require('./appCustomer.model');
const { hashAsync, isVerifyAsync } = require('../../../utils/security/bcrypt');
const OTP = require('../../../utils/security/otp');
const uploader = require('../../../utils/s3Uploader/s3Uploader');
const path = require('path');
const FormData = require('form-data');
const fs = require('fs');

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
    

    const docFront = newCustomerData.doc_front;
    const docBack = newCustomerData.doc_back;
    const faceImage = newCustomerData.image;
     console.log("--------facepath-------",customerData.image)




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
    
  // const faceImagePath = path.join(__dirname, 'uploads', faceImage.filename);
  // const docFrontPath = path.join(__dirname, 'uploads', docFront.filename);
  let extractData  = null; 
   let verifyLivenessRes =  await  verifyLiveness(newCustomerData.image,newCustomerData.doc_front)
   if(!verifyLivenessRes.data.isVerified){
       appCustomer.hasError = true;
       appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
       appCustomer.message = `Unable to create your Customer, please check your image verification.`;
   
       return toCamelCase(appCustomer);
    }
    newCustomerData.status = enumConstants.CUSTOMER_STATUS.UNVERIFIED;
    extractData =  await documentExtractionAPi(newCustomerData.doc_front);
    console.log("-------extractData--------",extractData.data)
    if(extractData == null || extractData.data ==null || extractData.data?.date_of_birth == undefined){

      appCustomer.hasError = true;
      appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCustomer.message = `Unable to extraction.`;
  
     return toCamelCase(appCustomer);
    }
   const dateOfBirth =  dateUtil.extractDateFromYYMMDD(extractData.data.date_of_birth);
   const expirayDate =  dateUtil.expirayDateYYMMDD(extractData.data.expiration_date);
   const issueDate =  dateUtil.addDays(dateUtil.getPreviousDateByYears(expirayDate, 10),1);
   console.log("---------expirayDate------------",expirayDate);
   console.log("---------issueDate------------",issueDate);



  //  if(expirayDate < new Date()){
  //   appCustomer.hasError = true;
  //   appCustomer.code = HTTP_STATUS.BAD_REQUEST;
  //   appCustomer.message = `your card has been expired.`;

  //   return toCamelCase(appCustomer);
  //  }

      //set object values
      newCustomerData.full_name = extractData.data.names;
      newCustomerData.sur_name = extractData.data.surname;
      newCustomerData.country = extractData.data.country;
      newCustomerData.dob   = dateOfBirth;
      newCustomerData.expiry_date  = expirayDate;
      newCustomerData.issue_date  = issueDate;
      newCustomerData.gender  = extractData.data.sex;
      newCustomerData.nationality = extractData.data.nationality;
      newCustomerData.id_no  = extractData.data.number;
      newCustomerData.score = extractData.data.valid_score;
      newCustomerData.doctype = "Passport";
      newCustomerData.imagelivenessresponse = verifyLivenessRes.data;
      newCustomerData.dataextractionresponse = extractData.data;
      newCustomerData.is_active = true;
      newCustomerData.status = enumConstants.CUSTOMER_STATUS.VERIFIED;

      const findCustomer = await appCustomerModel.findByIdNoAndStatus(newCustomerData.id_no, newCustomerData.status)
      if(findCustomer){
       appCustomer.hasError = true;
       appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
       appCustomer.message = `Customer ID No is already exist.`;
       logger.error(`Customer ID No is already exist.`);
       return toCamelCase(appCustomer);
      }

  // console.log("---------Date of birth------------",expirayDate);
    //End images upload
    const customerResult = await appCustomerModel.createCustomer(newCustomerData);
    if (customerResult && customerResult.rowCount > 0) {
      delete newCustomerData.imagelivenessresponse ;
      delete newCustomerData.dataextractionresponse
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

async function getCustomerList(custData) {
  let newCustData = custData;
  let appCustomerList = { hasError: false };
  try {
    newCustData = toSnakeCase(newCustData);
    console.log("---newCustData-----",newCustData)

    const result = await appCustomerModel.getCustomerList(newCustData);
    if (result) {
      appCustomerList = { ...appCustomerList, data: result };
      appCustomerList.message = `customer(s) fetched successfully`;
    } else {
      appCustomerList.hasError = true;
      appCustomerList.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCustomerList.message = `Unable fetch customer`;
      logger.error(
        `Unable fetch order ${MODULE.CUSTOMER}.
        Payload:: ${prettyPrintJSON(newCustData)}`
      );
    }
  } catch (error) {
    logger.error(
      `An error occurred fetching customer. ${MODULE.CUSTOMER}
      Error:: ${error}
      Trace:: ${error.stack}
      Payload:: ${prettyPrintJSON(newCustData)}`
    );
    appCustomerList.hasError = true;
    appCustomerList.message = error.detail;
    appCustomerList.code = error.code;
  }
  return toCamelCase(appCustomerList);
}

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


const verifyLiveness= async (faceImage, docImage)=>{

  let isVerified = false;
  let verifyRes = await verifyLivenessAPi(faceImage, docImage)
  let res = {};
  console.log("verifyRes------------------", verifyRes)
  try {
    if (verifyRes.success == true) {
      if (!verifyRes.data[0]['opencv_VGG-Face'].verified && !verifyRes.data[0]['opencv_ArcFace'].verified) {
        isVerified = false;
      } else {
        isVerified = true;
      }
      console.log("isverified++++++++4++++++++++ ", isVerified)
    } else {

    }

    res.success = false;
    res.data = { isVerified: isVerified, verifyRes: verifyRes.data };
    return res;
  } catch (e) {
    res.success = false;
    res.error = e;
    res.data = { isVerified: isVerified, verifyRes: null };

  }

  return res; 

}

const verifyLivenessAPi = async (faceImage, docImage)=>{

 // console.log("-------------faceImage--------------",faceImage)
  //console.log("-------------docImage--------------",docImage)
  let verifyLivenessAPiResponse = {  };

  const faceImageResponse = await axios({
    method: 'get',
    url: faceImage,
    responseType: 'stream'  // Ensures the response is a stream
  });

// Fetch the second file from S3
const docImageResponse = await axios({
    method: 'get',
    url: docImage,
    responseType: 'stream'  // Ensures the response is a stream
 });

//console.log("docImage-----------Response-----",docImageResponse)

  let data = new FormData();
  data.append('customerIdCard',docImageResponse.data, {
    filename: 'docImage.jpg',
    contentType: docImageResponse.headers['content-type']  // Set the correct content type
   });
   console.log("docImage-----------Response-----",docImageResponse.headers['content-type'] )

  data.append('customerImage',faceImageResponse.data, {
    filename: 'faceImage.jpg',
    contentType: faceImageResponse.headers['content-type']  // Set the correct content type
   });

  // Axios POST request with the form-data
await axios.post(process.env.PYTHON_API_ENDPOINT+'/py/verify', data, {
  headers: {
      ...data.getHeaders()  // This includes the correct form-data headers
  }
})
.then(response => {
  console.log('Success:', response.data);
  verifyLivenessAPiResponse.success = true;
  verifyLivenessAPiResponse.data = response.data;
})
.catch(error => {
  console.error('Error:', error);
  verifyLivenessAPiResponse.success = false;
  verifyLivenessAPiResponse.error = error;
});

return verifyLivenessAPiResponse;
}



const documentExtractionAPi = async (docImage) => {
  let documentExtractionAPiResponse = {};

  try {
      // Fetch the image file from S3
      const docImageResponse = await axios({
          method: 'get',
          url: docImage,
          responseType: 'stream'  // Ensures the response is a stream
      });

      const extension = path.extname(docImage).toLowerCase();

      let contentType;
      switch (extension) {
          case '.jpg':
          case '.jpeg':
              contentType = 'image/jpeg';
              break;
          case '.png':
              contentType = 'image/png';
              break;
          case '.gif':
              contentType = 'image/gif';
              break;
          default:
              contentType = 'application/octet-stream';  // Fallback, but this may not work
      }

      // Log the content type for debugging
      console.log("Manually Set Content-Type:", contentType);

      // Log the content type of the image
      console.log("docImage-----------Response Content-Type-----", docImageResponse.headers['content-type']);

      // Determine the filename and ensure it matches the MIME type
      const filename = docImageResponse.headers['content-type'] === 'image/png' ? 'docImage.png' : 'docImage.jpg';

      // Create FormData object
      let data = new FormData();
      data.append('idCardImage', docImageResponse.data, {
          filename: filename,
          contentType: contentType  // Set the correct content type
      });

      // Log FormData headers to verify
      // console.log("FormData Headers:", data.getHeaders());

      // Axios POST request with the form-data
      const response = await axios.post(process.env.PYTHON_API_ENDPOINT + '/py/extractText_fromImages_with_passporteye', data, {
          headers: {
              ...data.getHeaders()  // This includes the correct form-data headers
          }
      });

      console.log('Success:', response.data);
      documentExtractionAPiResponse.success = true;
      documentExtractionAPiResponse.data = response.data;
  } catch (error) {
      documentExtractionAPiResponse.success = false;
      documentExtractionAPiResponse.error = error;

      if (error.response) {
          console.log('Status Code:', error.response.status);
          console.log('Response Data:', error.response.data);
          documentExtractionAPiResponse.error= error.response
      } else if (error.request) {
          console.log('No Response Received:', error.request);
          documentExtractionAPiResponse.error= error.request

      } else {
          console.log('Error Message:', error.message);
          documentExtractionAPiResponse.error= error.message

      }
  }

  return documentExtractionAPiResponse;
}

module.exports = {
  createCustomer,
  getCustomerList
};
