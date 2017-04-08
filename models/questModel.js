module.exports = function(mongoose) {
/*
const CategorySchema = new Schema({
    categoryName: {
        type: String, unique: true, required: true
    }
}, {collection: 'CategorySchema'});

//model of QuestionSchema
const Categories = mongoose.model('CategorySchema', CategorySchema)


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
}, {collection: 'Question'});
 
//model of QuestionSchema
const Questions = mongoose.model('Questions', QuestionSchema);
*/
    var QuestSchema = new mongoose.Schema({
        categoryName: String,
        question: String,
        answer: String
    });

    var Question = mongoose.model('QuestionSchema', QuestSchema);


return Question;
}