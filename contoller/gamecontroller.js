module.exports = (io) => {

    // server side tracker of logged in users
    // used to populate initial list of online users
    let users = [];
    var running_games = [];
    var game = require("./game");
        /*
        ie:  running_game({roomid:1234,name:1234});
        ***user can change the name property
        */
    io.sockets.on('connection', socket => {
        
        // TODO: show all current usernames in users div on chatroom page
        
        // const user = { name: socket.request.user.name, username: socket.request.user.username };
        game.initGame(io, socket);
        running_games.push({roomid:1234,name:newroom});

        // function namechange(roomname,room){
        //     var hostname = running_games.filter(function(item){
        //         return item.name == roomname;
        //     });
        //     if(hostname){
        //         //change existing roomname
        //         findAndReplace(running_games, room, roomname);
        //     }else{
        //         running_games.push({roomid:room, name:roomname});
        //     }
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
        // socket.on('disconnect', socket => {
        //     io.sockets.emit('userLoggedOut', user.username);
        //     users.splice(users.indexOf(user.username),1); // remove from user tracker
        // });

    });// end on connection event

};

// function findAndReplace(object, value, replacevalue){
//   for(var x in object){
//     if(typeof object[x] == typeof {}){
//       findAndReplace(object[x], value, replacevalue);
//     }
//     if(object[x] == value){ 
//       object["roomname"] = replacevalue;
//       // break; // uncomment to stop after first replacement
//     }
//   }
// }




// users = [];

// users.push({user:username,user:roomid})

// function adduser(username, roomid){
//     users.push({user:username, user:roomid});
//     return users;
// }

// function removeuser(username, roomid){
//     var x = users.indexOf(username);
//     if(x >= 0){
//         users.splice(x,1);
//     }
// }

// exports.adduser = adduser;
// exports.removeuser = removeuser;
// exports.namechange = namechange;