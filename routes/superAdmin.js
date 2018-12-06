import express from 'express';
import passportAuth from '../authentication/passportAuth'

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Bossman' });
});

//router.get('/getAllAdmins', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.getAllAdmins);

//router.post('/updateAdminAccess', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.getAllAdmins);

module.exports = router;