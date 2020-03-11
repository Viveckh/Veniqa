import express from 'express';
import passportAuth from '../authentication/passportAuth';
import uiController from '../controllers/uiController.js';
var router = express.Router();

/* GET UI Customizations Endpoint. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Veniqa User Interface Customizations' });
});

router.use(passportAuth.isAuthenticated);

router.post('/featured', passportAuth.canManageFeatured, uiController.updateOrUpsertFeaturedSection);

router.get('/featuredList', passportAuth.canViewFeatured, uiController.getAllFeaturedSections);

router.get('/featured', passportAuth.canViewFeatured, uiController.getFeaturedSection);

router.delete('/featured', passportAuth.canManageFeatured, uiController.deleteFeaturedSection);

module.exports = router;