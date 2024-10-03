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

     const faceImg_base64 = customerData.image.buffer.toString('base64');
     const docFront_base64 = customerData.doc_front.buffer.toString('base64');
   

     // Output the Base64 string


   //images upload
   if(docFront ){
    const docFrontImg = await uploadImageDoc(newCustomerData.doc_front );
    delete newCustomerData.doc_front;
    newCustomerData.doc_front = docFrontImg.Location;
   // console.log("base 64------------------ ",newCustomerData.doc_front.buffer.toString('base64'));
  
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
    

   

    let extract_data = await idscanByAnalyzer(faceImg_base64, docFront_base64);

    console.log("----extract_data------",extract_data)


      //set object values
      newCustomerData.full_name = extract_data.fullName;
      newCustomerData.sur_name = extract_data.fullName;
      newCustomerData.country = extract_data.nationality;
      newCustomerData.dob   = extract_data.dob;
      newCustomerData.expiry_date  = extract_data.expiryDate;
      newCustomerData.issue_date  = extract_data.issuedate; //
      newCustomerData.gender  = extract_data.gender;
      newCustomerData.nationality = extract_data.nationality;
      newCustomerData.id_no  = extract_data.documentNumber;
      //newCustomerData.score = extractData.data.valid_score;
      newCustomerData.doctype = "Passport";
      //newCustomerData.imagelivenessresponse = verifyLivenessRes.data;
      newCustomerData.dataextractionresponse = extract_data;
      newCustomerData.is_active = true;

      newCustomerData.status =  extract_data?.documentWarnings.length > 0 ? enumConstants.CUSTOMER_STATUS.UNVERIFIED:enumConstants.CUSTOMER_STATUS.VERIFIED

      const findCustomer = await appCustomerModel.findByIdNoAndStatus(newCustomerData.id_no, newCustomerData.status)

      if(findCustomer){
       appCustomer.hasError = true;
       appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
       appCustomer.message = `Customer ID No is already exist.`;
       appCustomer.errors = extract_data?.documentWarnings.length > 0 ? extract_data?.documentWarnings: null;

       console.log("---appCustomer.errors-----",toCamelCase(appCustomer))
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
      appCustomer.errors = extract_data?.documentWarnings.length > 0 ? extract_data?.documentWarnings: null;

      appCustomer.message = `Your customer has been created successfully.`;
    } else {
      appCustomer.hasError = true;
      appCustomer.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      appCustomer.errors = extract_data?.documentWarnings.length > 0 ? extract_data?.documentWarnings: null;

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

const idscanByAnalyzer = async (faceImg_base64, docFront_base64)=>{
  let data = JSON.stringify({
    "document": docFront_base64,
    "face": faceImg_base64,
    "profile": "security_medium"
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: process.env.IDSCAN_API,
    headers: { 
      'X-API-KEY': process.env.IDSCAN_API_KEY, 
      'accept': 'application/json', 
      'content-type': 'application/json', 
      'Cookie': '__cflb=02DiuHwYc6VyiTumT63i15CDbKHcN2XqvA3fGiWMrTYZA'
    },
    data: data // Ensure 'data' is defined or passed correctly
  };
  
  try {
    const response = await axios.request(config);
    let extract_data = mapDocumentData(response.data);
    console.log(JSON.stringify(extract_data));
    return extract_data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }  

  
}
  // Function to map key-value pairs
  function mapDocumentData(responseData) {
    if (responseData.success) {
        const data = responseData.data;
        console.log("response----------", data);

        // Mapping the key-value pairs with safer checks
        const mappedData = {
            fullName: (data.fullName && data.fullName[0]?.value) || 'N/A',
            address: (data.address1 && data.address1[0]?.value) || 'N/A',
            dob: (data.dob && data.dob[0]?.value) || 'N/A',
            documentNumber: (data.documentNumber && data.documentNumber[0]?.value) || 'N/A',
            issuedate: (data.issued && data.issued[0]?.value) || 'N/A',
            expiryDate: (data.expiry && data.expiry[0]?.value) || 'N/A',
            gender: (data.sex && data.sex[0]?.value) || 'N/A',
            nationality: (data.nationalityIso2 && data.nationalityIso2[0]?.value) || 'N/A',
            documentWarnings: (responseData.warning || []).map(w => ({
                code: w.code,
                description: w.description,
                severity: w.severity,
                decision: w.decision
            }))
        };

        // Filtering high-severity rejects
        mappedData.documentWarnings = mappedData.documentWarnings.filter(warning => 
            warning.decision === "reject" && warning.severity === "high"
        );


        return mappedData;
    } else {
        return { error: "Failed to extract document data." };
    }
}

const uploadImageDoc = async (file)=>{
  const fileData = {
    Key: `docs/${uuidv4()}-${file.filename}`,
    Body: file.buffer,
    'Content-Type': file.mimetype,
  };
  const img = await uploader.uploadToAdminBucket(fileData);
return img;
}

const del = async (moduleName, id, body, logger) => {
  let newBody = body;
  let result = { hasError: false };
  try {
    const findResult = await appCustomerModel.findById(id);
    console.log("findResult---------- ",findResult,id)
    if (findResult && Object.keys(findResult).length > 0) {
      newBody.updatedDate = new Date();
      newBody.isActive = false;
      newBody.isDeleted = true;
      newBody = toSnakeCase(newBody);
      const updateData = await appCustomerModel.updateStatus(newBody, id);
      if (updateData) {
        newBody.id = findResult.id;
        result = { ...result, item: findResult };
        result.message = `${moduleName} has been deleted successfully`;
      } else {
        result.hasError = true;
        result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        result.message = `Unable to delete ${moduleName}. please check the payload.`;
        logger.error(
          `Unable to delete ${moduleName}.
        Payload:: ${prettyPrintJSON(result)}`
        );
      }
    } else {
      result.hasError = true;
      result.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
      result.message = `Unable to delete ${moduleName}. please check the id.`;
      logger.error(`Unable to delete ${moduleName}. please check the id.`);
    }
  } catch (error) {
    delete newBody.id;
    logger.error(
      `Unable to delete ${moduleName}.
    Error:: ${error}
    Trace:: ${error.stack}
    Payload:: ${prettyPrintJSON(newBody)}`
    );
    result.hasError = true;
    result.message = error.detail;
    result.code = error.code;
  }

  return toCamelCase(result);
};

module.exports = {
  createCustomer,
  getCustomerList,
  del
};
