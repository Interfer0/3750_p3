

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