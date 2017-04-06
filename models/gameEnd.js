const mongoose = require('mongoose');

// gameEnd Schema
const gameEndSchema = mongoose.Schema({
    gameRoomName: {
        type: String
    },
    player: [{
        type: String
    }],
    winner: {
        type: String
    },
    numberOfQuestions: {
        type: Number
    },
    playerScores: [{
        type: Number
    }],
    numberOfRounds: {
        type: Number
    },
    dateTimeGameEnd: {
        type: Date,
        default: Date.now
    }
});

const gameEnd = module.exports = mongoose.model('gameEnd', gameEndSchema);