module.exports = (io) => {

    var running_games = [];
    users = [];
/*
ie:  running_game({roomid:1234,name:1234});
***user can change the name property
*/


        io.sockets.on('connection', socket => {
            // TODO: show all current usernames in users div on chatroom page
            
            const user = { name: socket.request.user.name, username: socket.request.user.username };

            // do the the following on connection 
            socket.broadcast.emit('userLoggedIn', user.username);
            adduser(user.username, "default");
            //users.push({user:user.username,roomid:"tempid"});
            
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
                console.log('test');
                var pug = require('pug');
                res(pug.renderFile('views/includes/newGame.pug'));
            });

    });// end on connection even

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
}