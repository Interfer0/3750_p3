var express = require('express');
var router = express.Router();

const ensureAuthenticated = require('../lib/auth').ensureAuthenticated;
 
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Chat' });
});


module.exports = router;
