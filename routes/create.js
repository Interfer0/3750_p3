var express = require('express');
var router = express.Router();

/* GET create page. */
router.get('/create', function(req, res, next) {
  res.render('addCategory', { title: 'Create categories and questions' });
});

// Process Add Category
router.post('/addCategory', (req, res, next) => {
    const categories = req.body.categories;

    req.checkBody('categories', 'Category name is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('addCategory', {
            errors: errors
        });
    } else {
        const newCategory = new Category({
            categories: categories,
        });

        Category.newCategory(newCategory, (err, category) => {
            if (err) throw err;
            req.flash('success_msg','You have created a new category');
            res.redirect('/create/addCategory');
        });

    }
});

module.exports = router;