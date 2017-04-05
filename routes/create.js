var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
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
router.get('/Delete/QuestionAnswer', function(req, res, next) {
  res.render('deleteQuestionAnswer', { title: 'Delete categories' });
});

//Process Delete C,Q,A
router.post('/delete/questionAnswer', function(req, res, next) {
  var question = {
        categoryName: req.body.categoryName.toLowerCase(),
        question: req.body.question.toLowerCase(),
        answer: req.body.answer.toLowerCase()
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('QuestionSchema').find({categoryName: question.categoryName, question: question.question, answer: question.answer}).count(function(error, result) {
            if (result != 0 && error == null) {
                db.collection('QuestionSchema').deleteOne(question, function(err, result) {
                    assert.equal(null, err);
                    console.log('Question and Answer Deleted');
                    db.close();
                });
            }
        });
    });
    res.redirect('/select');
});

//get delete category page
router.get('/Delete/Category', function(req, res, next) {
  res.render('deleteCategory', { title: 'Delete categories' });
});

router.post('/delete/category', function(req, res, next) {
  var item = {
        categoryName: req.body.categoryName.toLowerCase(),
    };
  var question = {
        categoryName: req.body.categoryName.toLowerCase()
    };

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('CategorySchema').find({categoryName: item.categoryName}).count(function(error, result) {
            if (result != 0 && error == null) {
                db.collection('CategorySchema').deleteOne(item, function(err, result) {
                    assert.equal(null, err);
                    console.log('Category Deleted');
                    db.close();
                });
            }
        });
    });

    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('QuestionSchema').find({categoryName: question.categoryName}).count(function(error, result) {
            if (result != 0 && error == null) {
                db.collection('QuestionSchema').remove(question, function(err, result) {
                    assert.equal(null, err);
                    console.log('Question and Answer Deleted');
                    db.close();
                });
            }
        });
    });
    res.redirect('/select');
});

//////////////////////////////////////////////////////////////////////////////////////////
/* GET find page. */
router.get('/Find/create', function(req, res, next) {
  res.render('findQuestionAnswer', { title: 'Find questions and answers' });
});

router.get('/find/Question', function(req, res, next) {
    var resultArray = [];
    mongo.connect(url, function(err, db) {
        assert.equal(null, err);
        var cursor = db.collection('QuestionSchema').find();
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            console.log('Item found ' + resultArray[0]);
            db.close();
            res.redirect('/select');
        });
    });
});

//////////////////////////////////////////////////////////////////////////////////////////
//get update page
router.get('/Update/QuestionAnswer', function(req, res, next) {
  res.render('updateQuestionAnswer', { title: 'Update questions and answers' });
});

router.post('/update/Question', function(req, res, next) {
  var question = {
        categoryName: req.body.categoryName.toLowerCase(),
        question: req.body.question.toLowerCase(),
        answer: req.body.answer.toLowerCase()
  };

    var newQuestion = {
        newCategoryName: req.body.categoryName.toLowerCase(),
        newQuestion: req.body.question.toLowerCase(),
        newAnswer: req.body.answer.toLowerCase()
    };
  var id = question.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('QuestionSchema').find({question: question.question, answer: question.answer}).count(function(error, result) {
      if (result != 0 && error == null) {
            db.collection('QuestionSchema').updateOne(question, function(err, result) {
                assert.equal(null, err);
                console.log('Question and/or Category Deleted');
                db.close();
            });
      }
    });
  });
  res.render('/updateQuestionAnswer', {items: resultArray});
});

module.exports = router;