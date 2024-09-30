function extractDateFromYYMMDD(yyMMdd) {
  // Ensure the input is a string with exactly 6 characters
  if (typeof yyMMdd !== 'string' || yyMMdd.length !== 6) {
    throw new Error('Input must be a string in YYMMDD format.');
  }

  // Extract year, month, and day
  let year = yyMMdd.substring(0, 2); // '45'
  let month = yyMMdd.substring(2, 4); // '08'
  let day = yyMMdd.substring(4, 6); // '17'

  // Convert year into a full four-digit year
  // Here, we'll assume years '00' to '99' are 1900s or 2000s. Adjust based on your use case.
  let currentYear = new Date().getFullYear();
  let century = (currentYear % 100 >= parseInt(year)) ?  1900 :  2000;
  
  year = century + parseInt(year);

  // Construct a JavaScript Date object
  let date = new Date(`${year}-${month}-${day}`);

  // Return the date
  return date;
}
function expirayDateYYMMDD(yyMMdd) {
  // Ensure the input is a string with exactly 6 characters
  if (typeof yyMMdd !== 'string' || yyMMdd.length !== 6) {
    throw new Error('Input must be a string in YYMMDD format.');
  }

  // Extract year, month, and day
  let year = yyMMdd.substring(0, 2); // '45'
  let month = yyMMdd.substring(2, 4); // '08'
  let day = yyMMdd.substring(4, 6); // '17'

  // Convert year into a full four-digit year
  // Here, we'll assume years '00' to '99' are 1900s or 2000s. Adjust based on your use case.
  let currentYear = new Date().getFullYear();
  let century = (currentYear % 100 >= parseInt(year)) ?  2000 :  1900;
  
  year = century + parseInt(year);

  // Construct a JavaScript Date object
  let date = new Date(`${year}-${month}-${day}`);

  // Return the date
  return date;
}

function getPreviousDateByYears(dateString, years) {
  // Convert the string date into a Date object
  let date = new Date(dateString);

  // Subtract the specified number of years (10 years in this case)
  date.setFullYear(date.getFullYear() - years);

  return date;
}
function addDays(dateString, days) {
  // Convert the string date into a Date object
  let date = new Date(dateString);

  // Add the specified number of days (1 day in this case)
  date.setDate(date.getDate() + days);

  return date;
}
module.exports = {
  extractDateFromYYMMDD,
  expirayDateYYMMDD,
  getPreviousDateByYears,
  addDays
};
