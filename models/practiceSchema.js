module.exports = function(mongoose){

    var questionScheme = new mongoose.Schema({
        category: String, 
        question: String,
        answer: String,
    });

    
    
    var Category = mongoose.model('category', questionScheme);
    return Category;
}

