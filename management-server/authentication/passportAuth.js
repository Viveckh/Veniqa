var LocalStrategy   = require('passport-local').Strategy;
import bCrypt from 'bcrypt-nodejs';
import HttpStatusCode from "http-status-codes";
import User from '../database/models/user';
import * as _ from 'lodash';
import logger from '../logging/logger';

const checkPermissions = (req, res, validPermissions, done) => {
    const found = req.user.permissions.some(permission => validPermissions.includes(permission));
    if (found) {
        done();
    }
    else {
        logger.verbose('User doesnt have necessary permission to access this.');
        return res.status(HttpStatusCode.FORBIDDEN)
                .send('Permission denied for the user. User doesnt have necessary permission to access this');
    }
}

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
            //logger.debug('serializing user', {meta: user});
            done(null, user._id);
        });

        passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
                //logger.debug('deserializing user', {meta: user});
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
                    (err, user) => {
                        // In case of any error, return using the done method
                        if (err) {
                            return done(err);
                        }
                        // Username does not exist, log the error and redirect back
                        if (!user){
                            logger.verbose('User Not Found with username', {meta: username});
                            return done(null, false);                 
                        }
                        // User exists but wrong password, log the error 
                        if (!isValidPassword(user, password)){
                            logger.verbose('Invalid Password');
                            return done(null, false); // redirect back to login page
                        }

                        // If the user's account has not been approved, make sure to prevent login
                        if (!user.approved) {
                            logger.verbose("Account not approved for access")
                            return done(null, false);
                        }
    
                        // User and password both match, return user from done method
                        // which will be treated like success
                        return done(null, user);
                    }
                );

            })
        );

        var isValidPassword = (user, password) => {
            return bCrypt.compareSync(password, user.password);
        }
    },

    isAuthenticated(req, res, done){ 
        // Passport adds the isAuthenticated function in req body when successfully authenticated, removes when session expired or user logs out
        if (req.isAuthenticated()) {
            done()
        }
        else {
            return res.status(HttpStatusCode.UNAUTHORIZED).send('only for logged in users')
        }
    },

    isSuperAdmin(req, res, done) {
        // Validate if admin is a superadmin, otherwise return a 401
        const validPermissions = ['SUPERADMIN'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canManageCatalog(req, res, done) {
        let validPermissions = ['SUPERADMIN', 'CATALOG_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canViewCatalog(req, res, done) {
        let validPermissions = ['SUPERADMIN', 'CATALOG_MANAGE', 'CATALOG_VIEW'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canManageOrders(req, res, done) {
        let validPermissions = ['SUPERADMIN', 'ORDER_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canViewOrders(req, res, done) {
        let validPermissions = ['SUPERADMIN', 'ORDER_MANAGE', 'ORDER_VIEW'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canViewTariff(req, res, done) {
        const validPermissions = ['SUPERADMIN', 'TARIFF_VIEW', 'TARIFF_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canManageTariff(req, res, done) {
        const validPermissions = ['SUPERADMIN', 'TARIFF_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canViewCategories(req, res, done) {
        const validPermissions = ['SUPERADMIN', 'CATEGORIES_VIEW', 'CATEGORIES_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canManageCategories(req, res, done) {
        const validPermissions = ['SUPERADMIN', 'CATEGORIES_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canViewFeatured(req, res, done) {
        const validPermissions = ['SUPERADMIN', 'FEATURED_MANAGE', 'FEATURED_VIEW', 'FEATURED_PREVIEW'];
        return checkPermissions(req, res, validPermissions, done);
    },

    canManageFeatured(req, res, done) {
        const validPermissions = ['SUPERADMIN', 'FEATURED_MANAGE'];
        return checkPermissions(req, res, validPermissions, done);
    }
}
