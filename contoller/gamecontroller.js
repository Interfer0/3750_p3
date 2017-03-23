

var running_games = [];
/*
ie:  running_game({roomid:1234,name:1234});
***user can change the name property
*/

running_games.push({roomid:1234,name:newroom});

function namechange(roomname,room){
   if(running_games.indexOf(roomname) >= 0){
       return "room already being used";
   }else{
       running_games.push({roomid:room, name:roomname});
   }
}

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

    });// end on connection event

};





users = [];

users.push({user:username,user:roomid})

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