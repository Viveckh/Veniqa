import express from 'express';
import passportAuth from '../authentication/passportAuth';
import uiController from '../controllers/uiController.js';
var router = express.Router();

/* GET UI Customizations Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa User Interface Customizations' });
});

router.post('/featured', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, uiController.updateOrUpsertFeaturedSection);

router.get('/featuredList', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, uiController.getAllFeaturedSections);

router.get('/featured', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, uiController.getFeaturedSection);

router.delete('/featured', passportAuth.isAuthenticated, passportAuth.isSuperAdmin, uiController.deleteFeaturedSection);

module.exports = router;