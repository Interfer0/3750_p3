var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/select', function(req, res, next) {
  res.render('selectcq', { title: 'Select Categories and questions' });
});

module.exports = router;