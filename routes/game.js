var express = require('express');
var router = express.Router();

router.get('/game', (req, res, next) => {
    res.render('gameroom');
});

//send the initial game window
router.get('/game/initialGameRoom', (req, res, next) => {
    res.render('includes/initialGame');
});


//attempt to join room
router.post('/game/newGameRoom', (req, res, next) => {
    res.render('includes/newGame');
});

// gameover
router.get('/game/gameover', (req, res, next) => {
    res.render('gameover');
});

module.exports = router;