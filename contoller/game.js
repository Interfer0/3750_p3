
function Game(){};

    let roomname;
    let category;
    let players;
    let gameRounds;


    function createGame(req, res){
        console.log("Game creation has been initialized");
        gameRounds = req.rounds;
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




exports.roomname;
exports.gameRounds;
exports.Game = Game;