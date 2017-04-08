var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const questions = mongoose.model('QuestionSchema');

/* GET home page. */
router.get('/select', function(req, res, next) {
  questions.find().then(q => {
    res.render('selectcq', { title: 'Select Categories and questions', questions: q });
  })
});

module.exports = router;