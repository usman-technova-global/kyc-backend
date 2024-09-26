const bcrypt = require('../security/bcrypt');
const logger = require('../commonUtils/logger').systemLogger;

const printHelp = () => {
  logger.verbose(
    `Example Command:: node .\\src\\utils\\commandLine\\passwordGeneration.js password=abcd`
  );
};

for (let i = 2; i < process.argv.length; i++) {
  const keyValue = process.argv[i].split('=');
  if (keyValue.length > 1) {
    if (keyValue[0] === 'password') {
      bcrypt.hashAsync(keyValue[1]).then((hash) => {
        logger.verbose(`Hashed Password:`, hash);
        console.log(`Hashed Password:`, hash);
      });
    } else {
      printHelp();
    }
  } else {
    printHelp();
  }
}

//  bcrypt.hashAsync()
