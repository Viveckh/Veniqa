import express from 'express';
import securityController from '../controllers/securityController';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa Security' });
});

router.route('/signup').post(securityController.signup);

router.route('/login').post(securityController.login);

module.exports = router;