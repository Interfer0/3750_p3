var express = require('express');
var router = express.Router();

/* GET create page. */
router.get('/create', function(req, res, next) {
  res.render('addcqa', { title: 'Create categories and questions' });
});

// Process Add Category
router.post('/addcqa', (req, res, next) => {
    const categories = req.body.categories;

    req.checkBody('categories', 'Category name is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('addcqa', {
            errors: errors
        });
    } else {
        const newCategory = new Category({
            categories: categories,
        });

        Category.newCategory(newCategory, (err, category) => {
            if (err) throw err;
            req.flash('success_msg','You have created a new category');
            res.redirect('/create/addcqa');
        });

    }
});

module.exports = router;