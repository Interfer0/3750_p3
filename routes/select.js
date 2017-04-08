module.exports = (categories,question) => {
    var express = require('express');
    var router = express.Router();
    var mongo = require('mongodb').MongoClient;
    var objectId = require('mongodb').ObjectID;
    var assert = require('assert');
    const mongoose = require('mongoose');
    var url = 'mongodb://localhost:27017/Balderdash';


/* GET home page. */
router.get('/select', function(req, res, next) {
  question.find().then(q => {
            res.render('selectcq', { title: 'Delete categories', questions: q });
        })
        .catch(next);
});

        return router;
    };   