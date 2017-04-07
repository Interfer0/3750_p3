module.exports = function(mongoose) {

    var CatSchema = new mongoose.Schema({
        categoryName: String
    });

    var Category = mongoose.model('CategorySchema', CatSchema);
    return Category;
}