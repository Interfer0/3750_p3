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
        type: Number 
    },
    playerScores: [{
        type: Number 
    }],
    numRounds: {
        type: Number 
    },
    dateTimeGameEnd: {
        type: Date,
        default: Date.now
    }
});

const gameEnd = module.exports = mongoose.model('gameEnd', gameEndSchema);