const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    categoryName: {
        type: String, unique: true, required: true
    }
}, {collection: 'Categories'});

//model of QuestionSchema
const Categories = mongoose.model('Categories', CategorySchema)
//question schema loop through and get all unique items and return
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