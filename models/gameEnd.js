const mongoose = require('mongoose');

// gameEnd Schema
const gameEndSchema = mongoose.Schema({
    gameRoomName: {
        type: String
    },
    players: [{
        type: String
    }],
    winner: {
        type: String
    },
    numberOfQuestions: {
        type: Int
    },
    playerScores: [{
        type: Int
    }],
    numRounds: {
        type: Int
    },
    dateTimeGameEnd: {
        type: Date,
        default: Date.now
    }
});

const gameEnd = module.exports = mongoose.model('gameEnd', UserSchema);