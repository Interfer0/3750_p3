// var gamecontoller = require("./gamecontroller") 

var io;
var gameSocket;

exports.initGame = function(sio, socket){
    io = sio;
    gameSocket = socket;
    gameSocket.emit('connected',{message: "You are connected!"});

    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('roomFull',startGame);
    gameSocket.on('nextRound', nextRound);

    gameSocket.on('playJoinsGame', playerJoinsGame);
    gameSocket.on('playerAnswer', playerAnswer);
    

}

function createNewGame(){
   var thisGameId = (Math.random()*1000) | 0;
   this.emit('newGameCreated',{gameId: thisGameId, mySocketId: this.id});
   this.join(thisGameId.toString());
}

users = [];
function addUserToRoom(response, socket, {user:username, user:roomid}){
    socket.join(user.roomid);
    //socket.to(user.roomid).emit(function_name);
    socket.to(user.roomid).emit(user.username + " has join the game.");
    users.push({user:roomid, user:username});
    console.log(user.username + " has joined " + user.roomid);
    response.render('user',{username:user.username});
}

function randomHost(response){
    var x = users.length;
    if(x > 1 && gameRounds > 0){
        var host = users[Math.floor(Math.random() * x)];
        return host;
    }else{
        return "wait for more players";
    }
}

function countRounds(){
    gameRounds = gameRounds - 1;
}