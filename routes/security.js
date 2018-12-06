import express from 'express';
import securityController from '../controllers/securityController';
var router = express.Router();
import passport from 'passport';

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Security' });
});

router.route('/signup').post(securityController.signup);

router.post('/login', passport.authenticate('login'), (req, res, next) => {
    // If this part gets executed, it means authentication was successful
    // Regenerating a new session ID after the user is authenticated
    let temp = req.session.passport;
    req.session.regenerate((err) => {
        req.session.passport = temp;
        req.session.save((err) => {
            res.status(200).send({
                email: req.user.email,
                name: req.user.name,
                emailConfirmed: req.user.emailConfirmationToken ? 'false': 'true',
                permissions: req.user.permissions
            });
        })
    })
    
})

router.get('/isLoggedIn', (req, res, next) => {
    return res.status(200).send(req.isAuthenticated())
})

router.get('/logout', (req, res, next) => {
    req.logout();
    if (req.session) {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).send("server error - could not clear out session info completely")
            }
            return res.status(200).send("logged out successfully");
        });
    }
    else {
        if (req.isUnauthenticated()) {
            return res.status(200).send("logged out successfully");
        }
        else {
            return res.status(500).send("server error - could not log out")
        }
    }     
    console.log("after logout", req.session)
});

router.route('/resendEmailAddressConfirmationLink').get(securityController.resendEmailAddressConfirmationLink)

router.route('/confirmEmailAddress/:token').get(securityController.confirmEmailAddress);

router.route('/forgotPassword').get(securityController.forgotPassword);

router.route('/validatePasswordResetToken/:token').get(securityController.validatePasswordResetToken);

router.route('/resetPassword').post(securityController.resetPassword);

module.exports = router;