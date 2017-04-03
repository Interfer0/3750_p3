var roomname;
exports.Game = class Game{

    constructor(roomname,category,players,gamerounds){
        this.roomname = roomname;
        this.category = category;
        this.players = players;
        this.gamerounds = gamerounds;
        this.users = [];
    };

    cnslPrint(){
        console.log("worked");
    }

    createGame(req, res){
        console.log("Game creation has been initialized");
        //creates a random 5 digit room ID
        var gameID = roomname;
        //this will return the room ID and the client socket ID
        this.emit('joinRoom', {roomID: gameID, mySocketID: this.id});
        gameRounds = req.rounds;
    }

    addUserToRoom(response, socket, {user:username, user:roomid}){
        socket.join(user.roomid);
        //socket.to(user.roomid).emit(function_name);
        socket.to(user.roomid).emit(user.username + " has join the game.");
        users.push({user:roomid, socketID:socket.id});
        console.log(user.username + " has joined " + user.roomid);
        response.render('user',{username:user.username});
    }

    randomHost(response){
        var x = users.length;
        if(x > 1 && gameRounds > 0){
            var host = users[Math.floor(Math.random() * x)];
            return host;
        }else{
            return "wait for more players";
        }
        socket.to(host.user).emit('selectQuestion',)
    }

    countRounds(){
        gameRounds = gameRounds - 1;
    }

    displayQuestion(){
        socket.emit()
    }
};
