module.exports = (io) => {

    // server side tracker of logged in users
    // used to populate initial list of online users
    let users = [];
    let running_games = [];
    let Game = require("./game");
        /*
        ie:  running_game({roomid:1234,name:1234});
        ***user can change the name property
        */
    io.sockets.on('connection', socket => {

         const user = { name: socket.request.user.name, username: socket.request.user.username };
        //running_games.push({roomid:1234,name:newroom});

        function namechange(roomname,room){
            if(running_games.indexOf(roomname) >= 0){
                return "room already being used";
            }else{
                running_games.push({roomid:room, name:roomname});
            }
        }

        // do the the following on connection 
        socket.broadcast.emit('userLoggedIn', user.username);
        users.push(user.username);
        
        socket.on('getUser', (callback) => {
            io.sockets.emit('whoami', user);
        });

        socket.on('getUsers', (callback) => {
            io.to(socket.id).emit('userList', users); // only send userList to newly connected user
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

        socket.on('newGameRoom', function (req, res){
            var pug = require('pug');
            res(pug.renderFile('views/includes/newGame.pug'));
        });

        socket.on('createNewGame', function(req,res) {
            console.log(req);
            var roomname = req.roomname; //string of desired roomname;
            var category = req.category; //a array of all categories selected
            var players = req.players; //int of # of players
            var gameRounds = req.gameRounds; //int of # of games

            //if roomname exists in roomlist, send back warning message
            running_games.filter(function(item){
                if(roomname == item.name)
                {
                    res.status(400).send({error:"Room Exists!"});
                }
            });
            //create the new game object
            let gm1 = new require('./game');
            
            gm1.roomname = roomname;
            gm1.category = category;
            gm1.players = players;
            gm1.gameRounds = gameRounds;
            

            running_games.push(gm1);
            let gm = new require('./game');
            
            gm.roomname = "dsf";
            gm.category = category;
            gm.players = players;
            gm.gameRounds = gameRounds;
            

            running_games.push(gm);
            console.log(running_games);
                //add user to user list for new room

            //place user in new room

            //Send success, send roomname
            
        });

        socket.on('getCats', function(req,res) {
            //get the categories, 
        });

    });// end on connection event

};




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