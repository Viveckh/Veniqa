import express from 'express';
import securityController from '../controllers/securityController';
var router = express.Router();
import passport from 'passport';

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Security' });
});

router.route('/login').post(passport.authenticate('login'), securityController.login);

router.get('/isLoggedIn', (req, res, next) => {
    return res.status(200).send(req.isAuthenticated())
});

router.route('/logout').get(securityController.logout);

router.route('/forgotPassword').get(securityController.forgotPassword);

router.route('/validatePasswordResetToken/:token').get(securityController.validatePasswordResetToken);

router.route('/resetPassword').post(securityController.resetPassword);

module.exports = router;