module.exports = (io) => {

    // server side tracker of logged in users
    // used to populate initial list of online users
    let users = [];
    let assignedRoom = [];
    let running_games = [];
    let inst = require("./game");
    let pug = require('pug');
        /*
        ie:  running_game({roomid:1234,name:1234});
        ***user can change the name property
        */
    io.sockets.on('connection', socket => {


         const user = { 
             username: socket.request.user.username,
             roomname: ""
            };
         
         users[socket.id] = socket.request.user.username;
          

        function checkRoomName(roomname,room){
            if(running_games.indexOf(roomname) >= 0){
                return "room already being used";
            }else{
                running_games.push({roomid:room, name:roomname});
            }
        }

        socket.on('connected', function (req, res){            
        });

        
        
        socket.on('getUser', (callback) => {
            io.to(socket.id).sockets.emit('whoami', user);
        });

        socket.on('getUsers', (callback) => {
            io.to(socket.id).emit('userList', users); // only send userList to newly connected user
        });

        socket.on('roomUsers', (callback) => {
            var roomMembers = [];
            //console.log(user.roomname);
            //console.log(io.sockets.adapter.rooms);
            console.log(io.sockets.adapter.rooms[user.roomname].sockets);
            for( var member in io.sockets.adapter.rooms[user.roomname].sockets ) {
                console.log(users[member]);
            }

            io.to(user.roomname).emit('userListRoom', roomMembers); 
            //console.log(socket.request.user);
            //console.log(socket.adapter.nsp.adapter.sids);
            //console.log(socket.adapter.nsp.adapter.rooms);
            //console.log(io.sockets.adapter.rooms);
            //console.log(socket.id);
            //console.log(io.sockets.adapter.rooms['bob'].sockets);
        });
        
        // Client to Server message
        socket.on('c2smsg', function(data, callback){
            var chatObject = {person: user.username, message: data};
            socket.broadcast.emit('s2cmsg', chatObject);
        });

        // Notify the chat room the user disconnected
        // update the server side tracker
        socket.on('disconnect', socket => {
            io.sockets.emit('userLoggedOut', user.username);
            users.splice(users.indexOf(user.username),1); // remove from user tracker
        });

        socket.on('displayQuestions', function(req, res){
            var pug = require('pug');
            res({
                status:
                    200,
                page:
                    pug.renderFile('views/includes/displayQuestions.pug')
            });
        });
        
        socket.on('continueToPickclick', function(req,res){
            res({  
                status:
                    200,
                page :
                    pug.renderFile('views/includes/questionsPick.pug'),
                stage:
                    "questionsPick"
            });
        });


        socket.on('questionpicked', function(req,res) {

            var gm = running_games[user.roomname];
            //console.log(gm);
            //save question in game
            gm.pickquestion(io,req, function(res) {
                //console.log(res);
                io.to(user.roomname).emit('gotoAnswer', {
                    question:
                        res.question,
                    page: 
                        pug.renderFile('views/includes/requestAnswers.pug')
                });
            });
        });

        /*
        socket.on('displayQuestionandAnswer', function(req, res){
            var pug = require('pug');
            var question = choosenQuestion();
            res({
                status:
                    200,
                page:
                    pug.renderFile('views/includes/displayQuestionandAnswer.pug'),
                question:
                    question
            });
        });
        */
        

        socket.on('newGameRoom', function (req, res){
            var pug = require('pug');
            var room = validRoomNumber();
            res({  
                status:
                    200,
                page :
                    pug.renderFile('views/includes/newGame.pug'),
                roomid: 
                    room
            });
        });

        socket.on('whoami', function(req, res){ 
            res({ usr: users[socket.id]});           
        });

        socket.on('createNewGame', function(req,res) {
            //console.log(req);
            var roomname = req.roomname; //string of desired roomname;
            var category = req.category; //a array of all categories selected
            var players = req.players; //int of # of players
            var gamerounds = req.gamerounds; //int of # of games

            //if roomname exists in roomlist, send back warning message
            var i = null;
            for(i = 0;running_games.length > i; i += 1){
                if(running_games[i].roomname === roomname){
                    console.log("room already in use");
                }
                else{
                   res.send({status:400,page:""});
                }
            }


            //create the new game object
            var gm = new inst.Game(roomname,category,players,gamerounds);
            
            gm.roomname = roomname;
            gm.category = category;
            gm.players = players;
            gm.gamerounds = gamerounds;
            running_games[roomname] = gm;
            var roomUsers;
            gm.addUserToRoom(socket, user.username, function(ret) {
                roomUsers = ret;
            });
            //console.log(Ulist);
            user.roomname = roomname;
            //Send success, send roomname
            /*Don't know how to make this work yet. It needs to add the player as 
            a player on the players screen under names.*/ 
            res({  
                status:
                    200,
                page :
                    pug.renderFile('views/includes/wait01.pug',[room = roomname]),
                users :
                    roomUsers,
                room :
                    roomname,
                stage:
                    "wait1"
            });
        });

        socket.on('joinRoom', function(req,res) {
            var gm;
            
            //check if room exists return room doesn't exist if false
            if(running_games[req.room] != null)
            {
                user.roomname = req.room;
                gm = running_games[req.room];
                var roomUsers;
                gm.addUserToRoom(socket, user.username, function(ret) {
                    roomUsers = ret;
                });
                res({  
                    status:
                        200,
                    page :
                        pug.renderFile('views/includes/wait01.pug',[room = gm.roomname]),
                    users :
                        roomUsers,
                    room :
                        req.room,
                    stage:
                        "wait1"
                });            
                //if room is now full, pick a random user and send them the next button. 
                if(gm.players == gm.users.length)
                {
                    if(gm.currentPlayer == undefined)
                    {
                        var x = gm.randomHost();
                        var uid = Object.keys(users).find(key=> users[key] === x);
                        console.log (x + " " + uid);
                        gm.randomPlayerContinue(io,x);
                    }
                    else if(gm.currentPlayer == user.username)
                    {
                        gm.randomPlayerContinue(io, user.username);
                    }
                }
            } 
        });

        

        

        socket.on('getCats', function(req,res) {
            //get the categories, 
        });

        function getUser() {
            return user;
        }

        function validRoomNumber(){
            var num = (Math.random()*10000) | 0;
            var i = null;
            for(i = 0;running_games.length > i; i += 1){
                if(running_games[i].roomname === num){
                    return validRoomNumber();
                }
            }
            return num;
        }

    });// end on connection event

};

    function getrandomroom() 
    {
        //create random int
        if(runninggames.contain(randomenumber))
        {
            randomenumber = getrandomroom();
        }
        return randomenumber;
    }


/*


    running_games.push({roomid:1234,name:"newroom"});

        function namechange(roomname,room){
            if(running_games.indexOf(roomname) >= 0){
                return "room already being used";
            }else{
                running_games.push({roomid:room, name:roomname});
            }
        }

    //users.push({user:username,user:"roomid"})

    function adduser(username, roomid){
        users.push({user:username, user:roomid});
        return users;
    }

    function removeuser(username, roomid){
        var x = users.indexOf(username);
        if(x >= 0){
            users.splice(x,1);
        }
    }

    exports.adduser = adduser;
    exports.removeuser = removeuser;
    exports.namechange = namechange;
*/