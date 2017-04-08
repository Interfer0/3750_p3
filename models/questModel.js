module.exports = function(mongoose) {

    var QuestSchema = new mongoose.Schema({
        categoryName: String,
        question: String,
        answer: String
    });

    var Question = mongoose.model('QuestionSchema', QuestSchema);


return Question;
}