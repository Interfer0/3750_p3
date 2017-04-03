
exports.Game = class Game{

    constructor(roomname,category,players,gamerounds){
        this.roomname = roomname;
        this.category = category;
        this.players = players;
        this.gamerounds = gamerounds;
        this.users = [];
        this.round = 1;
    };

    cnslPrint(){
        console.log("worked");
    }

    createGame(req, res){
        console.log("Game creation has been initialized");
        gameRounds = req.rounds;
    }



    addUserToRoom(socket, username){
        //console.log(socket);
        socket.join(this.roomname);
        //socket.to(user.roomid).emit(function_name);
        socket.to(this.roomname).emit(username + " has join the game.");
        var found = this.users.some(function (el){
            return el.user === username;
        })
        if(!found)
        {
            this.users.push({user:username, screen:"wait1", socketID:socket.id});
        }
        console.log(username + " has joined " + this.roomname);
        socket.to(this.roomname).emit('updateUsers', {users : this.users});
    }

    randomHost(response){
        var x = users.length;
        if(x > 1 && gameRounds > 0){
            var host = users[Math.floor(Math.random() * x)];
            return host;
        }else{
            return "wait for more players";
        }
    }

    countRounds(){
        gameRounds = gameRounds - 1;
    }

   displayQuestion(){ 
        socket.emit() 
    } 
};
