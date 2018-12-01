import express from 'express';
import paymentController from '../controllers/paymentController';
import AuthClass from '../common/authenticationValidator'

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Inside home page", req.sessionID);
  res.render('index', { title: 'Veniqa' });
});


// var baba = function(req, res, next){
//   // console.log("REQ", req);
//   // console.log("RES", res);
//   console.log('This is running')
//   return res.status(200).send('You are logged in, so you can access this page')
// }

// router.get('/checkout', (req, res, next) => {
//   if (req.isAuthenticated()) {
//     console.log("logged in")
//     return res.status(200).send('You are logged in, so you can access this page')
//   }
//   return res.status(401).send('only for logged in users')
// });

router.get('/checkout', AuthClass.isAuthenticated , paymentController.checkout );

module.exports = router;
