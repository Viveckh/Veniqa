// Standard Express and Node Server imports
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// Babel imports, even though they aren't directly referenced, they need to be here
import babelCore from 'babel-core/register';
import babelPolyfill from 'babel-polyfill';

// Imports for session management
import uuidv4 from 'uuid/v4';
import session from 'express-session';
import redis from 'redis';
var RedisStore = require('connect-redis')(session);
import sessionConfig from './properties/session';
import redisConfig from './properties/redis';

// Router imports
import indexRouter from './routes/index';
import securityRouter from './routes/security';
import catalogRouter from './routes/catalog';
import shoppingRouter from './routes/shopping';

// Database connection imports, importing initializes it
import dbConnection from './database/dbConnection';

// Imports for authentication
import passport from 'passport';
import passportAuth from './authentication/passportAuth';

/************************************************************* */

// Redis client
var redisClient = redis.createClient({
  host: redisConfig.host, 
  port: redisConfig.port, 
  password: redisConfig.password, 
  tls: {
    host: redisConfig.host,
    port: redisConfig.port,
    servername: redisConfig.host
  }
});

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

/************************************************************* */

// Configure sessions
app.use(session({
  genid: (req) => {
    console.log("[SESSION]: Generating new session id: ", req.sessionID);
    return uuidv4() // Use UUIDs for session IDs
  },
  store: new RedisStore({
    host: redisConfig.host, 
    port: redisConfig.port, 
    pass: redisConfig.password, 
    client: redisClient
  }),
  secret: sessionConfig.secretKey,
  resave: false,  // setting true forces a resave in store even if session not changed
  rolling: true,  // setting true updates expiration with maxAge after every user request
  saveUninitialized: true,  // setting true saves even unmodified sessions
  cookie: {
    maxAge: sessionConfig.maxAge
    // secure: true, // Set this to true only after veniqa has a ssl enabled site
  }
}))

/************************************************************* */
// Configure authentication

passportAuth.initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

/************************************************************* */

// To Allow cross origin requests originating from selected origins
app.use(function(req, res, next) {
  var allowedOrigins = ['https://www.ngineerx.com', 'https://ngineerx.com', 'https://www.veniqa.com', 'https://veniqa.com', 'http://localhost:4200'];
  var origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', indexRouter);
app.use('/security', securityRouter);
app.use('/catalog', catalogRouter);
app.use('/shopping', shoppingRouter);

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
