module.exports = function(mongoose) {

    var geSchema = new mongoose.Schema({
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

    var gameEnd = mongoose.model('GameEndSchema', geSchema);
    return gameEnd;
}