import express from 'express';
import passportAuth from '../authentication/passportAuth'
import superAdminController from '../controllers/superAdminController';

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Bossman' });
});

router.post('/createAdmin', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.createAdmin);

router.get('/getAllAdmins', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.getAllAdmins);

router.get('/getAdminDetails', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.getAdminDetails);

router.put('/updateAdminAccess', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.updateAdminAccess);

router.delete('/deleteAdmin', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, superAdminController.deleteAdmin);

module.exports = router;