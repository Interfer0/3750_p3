module.exports = (categories,question) => {
    var express = require('express');
    var router = express.Router();
    var mongo = require('mongodb').MongoClient;
    var objectId = require('mongodb').ObjectID;
    var assert = require('assert');
    const mongoose = require('mongoose');
    var url = 'mongodb://localhost:27017/Balderdash';
    //const categories = mongoose.model('categoryschemas');

    ////////////////////////////////////////////////////////////////////////////////////////////*INSERT CATEGORY*/
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
            db.collection('categoryschemas').find({categoryName: item.categoryName}).count(function(error, result) {
                if (result == 0 && error == null) {
                    db.collection('categoryschemas').insertOne(item, function(err, result) {
                        assert.equal(null, err);
                        console.log('Category inserted');
                        db.close();
                    });
                }
            });
        });
        res.redirect('/select');
    });
    ////////////////////////////////////////////////////////////////////////////////////////////*INSERT QUESTION & ANSWER*/
    /* GET create page. */
    router.get('/Question/create', function(req, res, next) {
        categories.find().then(cat => {
            res.render('addQuestionAnswer', { title: 'Create Questions and Answers', categories: cat});
        })
        .catch(next);

    });

    // Process Add Question
    router.post('/create/addQuestionAnswer', (req, res, next) => {
        var question = {
            categoryName: req.body.category,
            question: req.body.question.toLowerCase(),
            answer: req.body.answer.toLowerCase()
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('questionschemas').find({categoryName: question.categoryName, question: question.question, answer: question.answer}).count(function(error, result) {
                if (result == 0 && error == null) {
                    db.collection('questionschemas').insertOne(question, function(err, result) {
                        assert.equal(null, err);
                        console.log('Question and Answer inserted');
                        db.close();
                    });
                }
            });
        });
        res.redirect('/select');
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////*DELETE*/
    /* GET delete page. */
    router.get('/Delete/QuestionAnswer', function(req, res, next) {
        categories.find().then(cat => {
            res.render('deleteQuestionAnswer', { title: 'Delete categories', categories: cat });
        })
        .catch(next);
    });

    //Process Delete C,Q,A
    router.post('/delete/questionAnswer', function(req, res, next) {
    var question = {
            categoryName: req.body.category,
            question: req.body.question.toLowerCase(),
            answer: req.body.answer.toLowerCase()
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('questionschemas').find({categoryName: question.categoryName, question: question.question, answer: question.answer}).count(function(error, result) {
                if (result != 0 && error == null) {
                    db.collection('questionschemas').deleteOne(question, function(err, result) {
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

    //process delete category
    router.post('/delete/category', function(req, res, next) {
    var item = {
            categoryName: req.body.categoryName.toLowerCase(),
        };
    var question = {
            categoryName: req.body.categoryName.toLowerCase()
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('categoryschemas').find({categoryName: item.categoryName}).count(function(error, result) {
                if (result != 0 && error == null) {
                    db.collection('categoryschemas').deleteOne(item, function(err, result) {
                        assert.equal(null, err);
                        console.log('Category Deleted');
                        db.close();
                    });
                }
            });
        });

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('questionschemas').find({categoryName: question.categoryName}).count(function(error, result) {
                if (result != 0 && error == null) {
                    db.collection('questionschemas').remove(question, function(err, result) {
                        assert.equal(null, err);
                        console.log('Question and Answer Deleted');
                        db.close();
                    });
                }
            });
        });
        res.redirect('/select');
    });

    ///////////////////////////////////////////////////////////////////////////////////////////*FIND*/
    /* GET find page. */
    router.get('/Find/create', function(req, res, next) {
    res.render('findQuestionAnswer', { title: 'Find questions and answers' });
    });

    //process find question
    router.get('/find/Question', function(req, res, next) {
        var resultArray = [];
        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            var cursor = db.collection('questionschemas').find();
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

    ///////////////////////////////////////////////////////////////////////////////////////////*UPDATE*/
    //get update page
    router.get('/Update/QuestionAnswer', function(req, res, next) {
    res.render('updateQuestionAnswer', { title: 'Update questions and answers' });
    });

    //process update question
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
            db.collection('questionschemas').find({question: question.question, answer: question.answer}).count(function(error, result) {
            if (result != 0 && error == null) {
                    db.collection('questionschemas').updateOne(question, function(err, result) {
                        assert.equal(null, err);
                        console.log('Question and/or Category Deleted');
                        db.close();
                    });
            }
            });
        });
        res.render('/updateQuestionAnswer', {items: resultArray});
    });

    ////////////////////////////////////////////////////////////////////////////////////////////*INSERT GAME-END INFO*/
    router.get('/endGame/create', function(req, res, next) {
        res.render('######addQuestionAnswer', { title: 'End of Game Information' });
    });
    // Process Add Question
    router.post('/create/######addQuestionAnswer', (req, res, next) => {
        var endInfo = {
            gameRoomName: req.body.gameRoomName.toLowerCase(),
            player: req.body.player.toLowerCase(),
            winner: req.body.winner.toLowerCase(),
            numberOfQuestions: req.body.numberOfQuestions,
            playerScores: req.body.playerScores,
            numberOfRounds: req.body.numberOfRounds,
            dateTimeGameEnd: req.body.dateTimeGameEnd
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('gameEndSchema').find({gameRoomName: endInfo.gameRoomName, player: endInfo.player, winner: endInfo.winner, numberOfQuestions: endInfo.numberOfQuestions, playerScores: endInfo.playerScores, numberOfRounds: endInfo.numberOfRounds, dateTimeGameEnd: endInfo.dateTimeGameEnd}).count(function(error, result) {
                if (result == 0 && error == null) {
                    db.collection('gameEndSchema').insertOne(endInfo, function(err, result) {
                        assert.equal(null, err);
                        console.log('End Of Game Info Saved');
                        db.close();
                    });
                }
            });
        });
        res.redirect('/select');
    });

        return router;
    };    