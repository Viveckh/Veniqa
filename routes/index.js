import express from 'express';
import paymentController from '../controllers/paymentController';
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Inside home page", req.sessionID);
  res.render('index', { title: 'Veniqa' });
});

router.get('/checkout', (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log("logged in")
    return res.status(200).send('You are logged in, so you can access this page')
  }
  return res.status(401).send('only for logged in users')
});

module.exports = router;
