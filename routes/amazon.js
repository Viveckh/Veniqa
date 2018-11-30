import express from 'express';
var router = express.Router();

/* GET Amazon Endpoint. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Veniqa Amazon' });
});

module.exports = router;