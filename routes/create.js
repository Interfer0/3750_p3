module.exports = (categories,question,gameEnd) => {
    var express = require('express');
    var router = express.Router();
    var mongo = require('mongodb').MongoClient;
    var objectId = require('mongodb').ObjectID;
    var assert = require('assert');
    const mongoose = require('mongoose');
    var url = 'mongodb://localhost:27017/Balderdash';
    const ensureAuthenticated = require('../lib/auth').ensureAuthenticated;
    //const categories = mongoose.model('categoryschemas');

    ////////////////////////////////////////////////////////////////////////////////////////////*INSERT CATEGORY*/
    /* GET create page. */
    router.get('/Category/create', ensureAuthenticated, function(req, res, next) {
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
    router.get('/Question/create', ensureAuthenticated, function(req, res, next) {
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
    router.get('/Delete/QuestionAnswer', ensureAuthenticated, function(req, res, next) {
        question.find().then(q => {
            res.render('deleteQuestionAnswer', { title: 'Delete categories', questions: q });
        })
        .catch(next);
    });

    //Process Delete C,Q,A
    router.post('/delete/questionAnswer', function(req, res, next) {
    var question = {
            //categoryName: req.body.category,
            question: req.body.question
            //answer: req.body.answer.toLowerCase()
        };

        mongo.connect(url, function(err, db) {
            assert.equal(null, err);
            db.collection('questionschemas').find({categoryName: question.categoryName, question: question.question, answer: question.answer}).count(function(error, result) {
            //db.collection('questionschemas').find({question: question.question}).count(function(error, result) {
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
    router.get('/Delete/Category', ensureAuthenticated, function(req, res, next) {
     categories.find().then(cat => {
            res.render('deleteCategory', { title: 'Delete Cateogry', categories: cat});
        })
        .catch(next);
    });

    //process delete category
    router.post('/delete/category', function(req, res, next) {
    var item = {
            categoryName: req.body.categoryName
        };
    var question = {
            categoryName: req.body.categoryName
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
       question.find().then(q => {
            res.render('/select/', { title: 'Find Questions and Answers', question: q});
        })
        .catch(next);
    /router.get('/Find/create', ensureAuthenticated, function(req, res, next) {
    /res.render('findQuestionAnswer', { title: 'Find questions and answers' });
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

    ///////////////////////////////////////////////////////////////////////////////////////////*UPDATE*/
    //get update page
    router.get('/Update/QuestionAnswer', ensureAuthenticated, function(req, res, next) {
        var id = req.query.id;
        categories.find().then(cat => {
            question.findById(id, function(err,q) {
                res.render('updateQuestionAnswer', { title: 'Update questions and answers', question: q, categories: cat});
            });
        });
    });

    //process update question
    router.post('/Update/Question', function(req, res, next) {
        var id = req.body.id;

        question.findById(req.body.id,function(err,q){
            q.question = req.body.question.toLowerCase();
            q.categoryName = req.body.categoryName.toLowerCase();
            q.answer = req.body.answer.toLowerCase();

            q.save();

        res.redirect('/select');
        });
                
    });

    ////////////////////////////////////////////////////////////////////////////////////////////*INSERT GAME-END INFO*/
    router.get('/EndGame/create', ensureAuthenticated, function(req, res, next) {
        gameEnd.find().then(ge => {
            res.render('gameover', { title: 'End of Game Information', gameEnd: g});
        })
        .catch(next);
    });

    // Process end of game info
    router.post('/create/GameOver', (req, res, next) => {
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

    /* GET home page. */
    router.get('/select', ensureAuthenticated, function(req, res, next) {
        question.find().then(q => {
            res.render('selectcq', { title: 'All Items', questions: q });
        })
        .catch(next);
    });

        return router;
    };    

// const Question = require('../models/questModel');
// exports.index = (req, res) => {
//   Question.find((err, questions) => {
//     if (err) {
//       console.log("Error: " + err);
//     } else {
//       res.render('/select', {
//         title: 'website',
//         questions: categoryName, questions: question, questions: answer,
//       });
//     }
//   });
// };