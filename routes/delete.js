var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var assert = require('assert');

var url = 'mongodb://localhost:27017/Balderdash';

// router.delete('/delete', function(req, res) {
//     Course.findById(req.body._id, function (err, itm) {
//         if(itm == null){
//             res.status(400).send("Course not Found");
//         } else {
//             itm.remove();
//             res.status(200).send("");
//         }
//     });
// });

// router.delete('/course/project', function(req, res) {
//     console.log("ter");
//     Course.find({}, function (err, itm) {
//         itm.forEach(function (e){
//             var udated = e.cprojects.id('58d7fe4242618b4454e1af1e');
//             if (udated != null)
//             {
//                 e.cprojects.id('58d7fe4242618b4454e1af1e').remove();
//                 e.save();
//                 res.status(200).send("Project Removed!");
//             }
//         })
//     });
// });