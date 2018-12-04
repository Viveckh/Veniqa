var LocalStrategy   = require('passport-local').Strategy;
import bCrypt from 'bcrypt-nodejs';
import User from '../database/models/user';

export default {
    initializePassport(passport) {
        // Configure Passport authenticated session persistence.
        //
        // In order to restore authentication state across HTTP requests, Passport needs
        // to serialize users into and deserialize users out of the session.  The
        // typical implementation of this is as simple as supplying the user ID when
        // serializing, and querying the user record by ID from the database when
        // deserializing.

        // Passport needs to be able to serialize and deserialize users to support persistent login sessions
        passport.serializeUser(function(user, done) {
            console.log('serializing user: ');console.log(user);
            done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                console.log('deserializing user:',user);
                done(err, user);
            });
        });

        // Configure the local strategy for use by Passport.
        //
        // The local strategy require a `verify` function which receives the credentials
        // (`username` and `password`) submitted by the user.  The function must verify
        // that the password is correct and then invoke `cb` with a user object, which
        // will be set at `req.user` in route handlers after authentication.
        passport.use('login', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password'
            },
            function(username, password, done) { 
                // check in mongo if a user with username exists or not
                User.findOne({ 'email' :  username }, 
                    function(err, user) {
                        // In case of any error, return using the done method
                        if (err) {
                            return done(err);
                        }
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            console.log('User Not Found with username '+ username);
                            return done(null, false);                 
                        }
                        // User exists but wrong password, log the error 
                        if (!isValidPassword(user, password)){
                            console.log('Invalid Password');
                            return done(null, false); // redirect back to login page
                        }
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    }
                );

            })
        );
        

        passport.use('signup', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback : true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {

                var findOrCreateUser = function(){
                    // find a user in Mongo with provided username
                    User.findOne({ 'email' :  username }, function(err, user) {
                        // In case of any error, return using the done method
                        if (err){
                            console.log('Error in SignUp: '+err);
                            return done(err);
                        }
                        // already exists
                        if (user) {
                            console.log('User already exists with username: ' + username);
                            return done(null, false);
                        } else {
                            // if there is no user with that email
                            // create the user
                            var newUser = new User({
                                email: username,
                                password: createHash(password),
                                name: req.param('name')
                            });

                            // save the user
                            newUser.save((err) => {
                                if (err){
                                    console.log("[ERROR]: User insertion failed => ", err)  
                                    return done(err);  
                                }
                                console.log("[DB]: User inserted => ", newUser);    
                                return done(null, newUser);
                            });
                        }
                    });
                };
                // Delay the execution of findOrCreateUser and execute the method
                // in the next tick of the event loop
                process.nextTick(findOrCreateUser);
            })
        );


        var isValidPassword = (user, password) => {
            return bCrypt.compareSync(password, user.password);
        }

        // Generates hash using bCrypt
        var createHash = function(password){
            return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
        }
    },

    isAuthenticated(req, res, done){ 
        // Passport adds the isAuthenticated function in req body when successfully authenticated, removes when session expired or user logs out
        if (req.isAuthenticated()) {
            console.log("logged in")
            done()
        }
        else {
            return res.status(401).send('only for logged in users')
        }
    }
}
