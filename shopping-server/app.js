// Environment and configurations, importing executes the script
import  './config';

// Standard Express and Node Server imports
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import config from 'config';

// Babel imports, even though they aren't directly referenced, they need to be here
import babelCore from 'babel-core/register';
import babelPolyfill from 'babel-polyfill';

// Imports for session management
import uuidv4 from 'uuid/v4';
import session from 'express-session';
import redis from 'redis';
var RedisStore = require('connect-redis')(session);

// Imports for Rate Limiting (DDos attacks prevention)
import RateLimit from 'express-rate-limit';
import RateLimitRedis from 'rate-limit-redis';

// Database connection imports
import db from './database/dbConnection';

// Router imports
import indexRouter from './routes/index';
import amazonRouter from './routes/amazon';
import securityRouter from './routes/security';
import catalogRouter from './routes/catalog';
import shoppingRouter from './routes/shopping';
import userRouter from './routes/user';
import orderRouter from './routes/orders';
import uiRouter from './routes/ui';

// Imports for authentication
import passport from 'passport';
import passportAuth from './authentication/passportAuth';

/************************************************************* */
// Establish database connection
db.dbConnection();

/************************************************************* */
// Redis client
var redisClient = null;

if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
  redisClient = redis.createClient(process.env.VENIQA_REDIS_HOST);
}
else {
  redisClient = redis.createClient({
    host: process.env.VENIQA_REDIS_HOST, 
    port: process.env.VENIQA_REDIS_PORT, 
    password: process.env.VENIQA_REDIS_PASSWORD, 
    db: Number(process.env.VENIQA_REDIS_DB_NUMBER),
    tls: {
      host: process.env.VENIQA_REDIS_HOST,
      port: process.env.VENIQA_REDIS_PORT,
      servername: process.env.VENIQA_REDIS_HOST
    }
  });
}

redisClient.on('error', err => {
  console.error("Redis encountered an error --> ", err )
})

/************************************************************* */

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());

/************************************************************* */

// Configure sessions
app.use(session({
  genid: (req) => {
    return uuidv4() // Use UUIDs for session IDs
  },
  store: new RedisStore({
    host: process.env.VENIQA_REDIS_HOST, 
    port: process.env.VENIQA_REDIS_PORT, 
    pass: process.env.VENIQA_REDIS_PASSWORD, 
    db: Number(process.env.VENIQA_REDIS_DB_NUMBER),
    client: redisClient
  }),
  secret: process.env.VENIQA_SESSION_SECRET_KEY,
  resave: false,  // setting true forces a resave in store even if session not changed
  rolling: true,  // setting true updates expiration with maxAge after every user request
  saveUninitialized: true,  // setting true saves even unmodified sessions
  cookie: {
    httpOnly: true,
    maxAge: config.get('session.max_age')
    // secure: true, // Set this to true only after veniqa has a ssl enabled site
  }
}))

/************************************************************* */
// Configure Request Rate Limiter

var limiter = new RateLimit({
  store: new RateLimitRedis({
    client: redisClient,
    expiry: 60 * 15 // How long each rate limiting window exists for in seconds
  }),
  windowMs: 60 * 1000, // 1 minute window in milliseconds
  max: 200, // limit each IP to 200 requests per windowMs
  delayMs: 0,  // disable delaying - full speed until the max limit is reached
  statusCode: 429
})

app.use(limiter);

/************************************************************* */
// Configure authentication

passportAuth.initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

/************************************************************* */

// To Allow cross origin requests originating from selected origins
var corsOptions = {
  origin: config.get('allowed_origins'),
  methods: ['GET, POST, OPTIONS, PUT, DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions));

/************************************************************** */

app.use('/', indexRouter);
app.use('/security', securityRouter);
app.use('/amazon', amazonRouter);
app.use('/catalog', catalogRouter);
app.use('/shopping', shoppingRouter);
app.use('/user', userRouter);
app.use('/orders', orderRouter);
app.use('/ui', uiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
