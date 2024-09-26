const { createLogger, format, transports } = require('winston');
const { globalVars } = require('../../serverConst');

const { combine, timestamp /* , label */, printf /* , colorize */, errors } =
  format;

transports.DailyRotateFile = require('winston-daily-rotate-file');

function buildLogger(LOGGER_NAME) {
  const logFormat = printf((info) => {
    if (info instanceof Error) {
      return `${info.timestamp}\n${info.level}: ${info.message} ${info.stack}\n`;
    }
    return `${info.timestamp}\n${info.level}: ${info.message}\n`;
  });

  const dailyRotateFileTransportOptions = {
    level: 'info',
    filename: `${globalVars.rootPath}/logs/${LOGGER_NAME}.%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    handleExceptions: true,
    maxSize: '50m',
    maxFiles: '365d',
  };
  const consoleTransportOptions = { level: 'verbose' };
  return createLogger({
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    ),
    // format: winston.format.simple(),
    //   defaultMeta: { service: "user-service" },
    transports: [
      new transports.Console(consoleTransportOptions),
      new transports.DailyRotateFile(dailyRotateFileTransportOptions),
    ],
  });
}

module.exports = buildLogger;
