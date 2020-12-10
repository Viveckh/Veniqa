import winston from 'winston';
import winstonMongoTransport from 'winston-mongodb'; // This will expose winston.transports.MongoDB
import config from 'config';

// Winston needs to be told about color coding, but it only takes effect on loggers where the format parameter has a colorize called
winston.addColors({
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  verbose: 'dim white',
  debug: 'gray',
  silly: 'magenta'
});

// The filepath is from the root of the project
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${info.meta ? info.meta : ''}`)
  ),
  transports: [
    new winston.transports.File({ 
      level: 'error',
      filename: 'logging/logs/' + config.get('logging.error_log_file_name')
    }),
    new winston.transports.File({ 
      filename: 'logging/logs/' + config.get('logging.combined_log_file_name')
    }),
    new winston.transports.MongoDB({ 
      level: 'error',
      db: process.env.VENIQA_MONGODB_URL,
      options: {useNewUrlParser: true, useUnifiedTopology: true},
      collection: config.get('logging.mongodb_collection'),
      capped: false
    }),
    new winston.transports.Console({}),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logging/logs/' + config.get('logging.exception_log_file_name')}),
  ]
});

module.exports = logger;