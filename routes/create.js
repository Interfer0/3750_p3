var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/Balderdash';

/* GET create page. */
router.get('/Category/create', function(req, res, next) {
  res.render('addCategory', { title: 'Create categories' });
});

// Process Add Category
router.post('/create/addCategory', (req, res, next) => {
    var item = {
        categoryName: req.body.categoryName
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('CategorySchema').insertOne(item, function(err, result) {
            assert.equal(null, err);
            console.log('Category inserted');
            db.close();
        });
    });

    res.redirect('/select');
});
///////////////////////////////////////////////////////////////////////////////////////////
/* GET create page. */
router.get('/Question/create', function(req, res, next) {
  res.render('addQuestionAnswer', { title: 'Create Questions and Answers' });
});

// Process Add Question
router.post('/create/addQuestionAnswer', (req, res, next) => {
    var question = {
        categoryName: req.body.categoryName,
        question: req.body.question,
        answer: req.body.answer
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('QuestionSchema').insertOne(question, function(err, result) {
            assert.equal(null, err);
            console.log('Question and Answer inserted');
            db.close();
        });
    });

    res.redirect('/select');
});


module.exports = router;