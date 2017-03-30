const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
// Categories Schema
// const CategoriesSchema = new Schema({
//     categories: {
//         type: String
//     },
//     question: [{
//     }]
// }, {collection: 'Categories'});

const CategorySchema = new Schema({
    categoryName: {
        type: String
    }
}, {collection: 'Categories'});
 
//model of QuestionSchema
const Categories = mongoose.model('Categories', CategorySchema)

const QuestionSchema = new Schema({
    categoryName: {
        type: String
    },
    question: {
        type: String
    },
    answer: {
        type: String
    }
}, {collection: 'Questions'});
 
//model of QuestionSchema
const Questions = mongoose.model('Questions', QuestionSchema)
 
//const Categories = module.exports = mongoose.model('Categories', CategoriesSchema);
 
//find and get data
/*router.get('/', function(req, res, next) {
    Categories.find()
        .then(function(doc) {
        res.render('index', {items: doc});
        });
});
 
router.post('/insert', function(req, res, next) {
    var item = {
        categories: req.body.categories,
        question: req.body.question
    };
 
    //store data
    var category = new Categories(item);
    category.save();
    res.reditrect('/');
});*/