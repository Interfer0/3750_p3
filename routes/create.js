var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/Balderdash';

/* GET create page. */
router.get('/Category/create', function(req, res, next) {
  res.render('addCategory', { title: 'Create categories' });
});

// Process Add Category
router.post('/create/addCategory', (req, res, next) => {
    var item = {
        categoryName: req.body.categoryName.toLowerCase()
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('CategorySchema').find({categoryName: item.categoryName}).count(function(error, result) {
            if (result == 0 && error == null) {
                db.collection('CategorySchema').insertOne(item, function(err, result) {
                    assert.equal(null, err);
                    console.log('Category inserted');
                    db.close();
                });
            }
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
        categoryName: req.body.categoryName.toLowerCase(),
        question: req.body.question.toLowerCase(),
        answer: req.body.answer.toLowerCase()
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('QuestionSchema').find({categoryName: question.categoryName, question: question.question, answer: question.answer}).count(function(error, result) {
            if (result == 0 && error == null) {
                db.collection('QuestionSchema').insertOne(question, function(err, result) {
                    assert.equal(null, err);
                    console.log('Question and Answer inserted');
                    db.close();
                });
            }
        });
    });

    res.redirect('/select');
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////
/* GET delete page. */
router.get('/delete/create', function(req, res, next) {
  res.render('deleteCategory', { title: 'Delete categories' });
});

//Process Delete C,Q,A
router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('CategorySchema').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;