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
router.post('/game/joinRoom', (req, res, next) => {
    var roomRequested= req.body.room;
    //if room is open and waiting, redirect the user and 
    //do everthing associated

    //if room full send that message as a failure

    //if room does not exist send that as a failure

    //if user is not logged in, redirect to login page. Though this should never happen
    res.status(200).json({ message:"FAILED!"});
});

//attempt to join room
router.post('/game/newGameRoom', (req, res, next) => {
    res.render('includes/newGame');
});

module.exports = router;