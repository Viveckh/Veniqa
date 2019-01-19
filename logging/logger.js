import winston from 'winston';
import winstonMongoTransport from 'winston-mongodb'; // This will expose winston.transports.MongoDB
import mongodbConfig from '../properties/mongodb'

// Winston needs to be told about color coding, but it only takes effect on loggers where the format parameter has a colorize called
winston.addColors({
  error: 'bold red',
  warn: 'yellow',
  info: 'green',
  verbose: 'dim white',
  debug: 'gray',
  silly: 'magenta'
});

// The filepath is from the root of the project since that's where this file is executed within app.js
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message} ${info.meta}`)
  ),
  transports: [
    new winston.transports.File({ 
      level: 'error',
      filename: 'logging/logs/error.log'
    }),
    new winston.transports.File({ 
      filename: 'logging/logs/combined.log'
    }),
    new winston.transports.Console({}),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logging/logs/exceptions.log'}),
  ]
});

// If in production, only then log to mongodb
if (process.env.NODE_ENV == 'production') {
    logger.add(new winston.transports.MongoDB({ 
        level: 'error',
        db: mongodbConfig.url,
        options: {useNewUrlParser: true},
        collection: 'veniqa_public_server_error_log',
        capped: true
    }));
  }

module.exports = logger;