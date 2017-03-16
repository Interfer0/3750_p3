var express = require('express');
var router = express.Router();

router.get('/game', (req, res, next) => {
    res.render('gameroom');
});


module.exports = router;