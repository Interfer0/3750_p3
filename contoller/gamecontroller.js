module.exports = (io, Categories, Questions) => { 
    /*
    const mongoose = require('mongoose'); 
    var url = 'mongodb://localhost:27017/Balderdash'; 
    var db = mongoose.connection; 
    db.on('error', console.error.bind(console, 'connection error:')); 
    db.once('open', function() { 
        console.log('Connected from game controller'); 
    }); */
    //var Categories = require('../models/catModel')(mongoose); 

    // server side tracker of logged in users
    // used to populate initial list of online users
    let users = [];
    let assignedRoom = [];
    let running_games = {};
    let roomname = String("");
    let inst = require("./game");
    let pug = require('pug');
    require('mongoose-query-random');
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

            console.log(io.sockets.adapter.rooms[user.roomname].sockets);
            for( var member in io.sockets.adapter.rooms[user.roomname].sockets ) {
                console.log(users[member]);
            }

            io.to(user.roomname).emit('userListRoom', roomMembers); 
        });
        
/*        // Client to Server message
        socket.on('c2smsg', function(data, callback){
            var chatObject = {person: user.username, message: data};
            socket.broadcast.emit('s2cmsg', chatObject);
        });*/

        // Notify the chat room the user disconnected
        // update the server side tracker
        socket.on('disconnect', socket => {
            io.sockets.emit('userLoggedOut', user.username);
            
        });

        // socket.on('displayQuestions', function(req, res){
        //     console.log("displayQuestion callback.")
        //     var pug = require('pug');
        //     var gm = running_games[user.roomname];
        //     // var questions = gm.getQuestions(Categories,);
        //     var questions = [];

        //     for(var i = 0; i < temp.length; i += 1){
        //         Questions.find({categoryName: gm.category[i].categoryName}).random(1, true, function(err,data){
        //             console.log(data)
        //             questions.push(data);
        //         })
        //     }
            
        /*
            Fired: when the chosen user clicks to continue to pick a question. 
            This also gets the questions and sends it with the questionsPick page. 
        */
        socket.on('continueToPickclick', function(req,res){
            var pug = require('pug');
            var gm = running_games[user.roomname];
            var temp = gm.category;
            var questions = [];

            for(var i = 0; i < temp.length; i += 1){
                Questions.find({categoryName: gm.category[i].categoryName}).random(1, true, function(err,data){
                    console.log(data)
                    questions.push(data);
                })
            }
            res({  
                status:
                    200,
                page :
                    pug.renderFile('views/includes/questionsPick.pug'),
                questions:
                    questions
            });
            //set users screen to 
            gm.setRoom(user.username, "questionpick");
            var question = {question:"this is the Question", answer:"An answer"};
            
                gm.questionPickingTimeout(io, user.username, user.roomname,question);
            
            
        });

        /*
            FIRED: when a user has picked a question. This will send
            all users to the requestAnswers screen.  
        */
        socket.on('questionpicked', function(req,res) {
            var gm = running_games[user.roomname];
            //console.log(gm);
            //save question in game
            gm.pickquestion(io,req,user, function(res) {
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
            FIRED: when a user selects and answer. 
            This calls to the game object to save the answer to the game answers array
            This then provides the wait2 screen for the users game. 
            Lastly it moves the user within the game to the wait2 screen, if they are the last user,
            it will move all users to pick best answer
        */
        socket.on('submitAnswer',function(req,res) {
            var gm = running_games[user.roomname];
            gm.saveUsersAnswer(req, user.username);
            //move user to waiting
            res({
                page:
                    pug.renderFile('views/includes/wait2.pug')
            })
            gm.wait2status(io,user);
        });

        
        socket.on('displayQuestionandAnswer', function(req, res){
            var gm = running_games[user.roomname]; 
            gm.storePickedAnswer(req); 
            gm.moveUserToWait3(io); 
            res({
                status:
                    200,
                page:
                    pug.renderFile('views/includes/wait3.pug'),
                question:
                    question
            });
        });
        
        /*
            FIRED: when the user enters the screen to create a new game
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

        /*
            FIRED: when the user creates a new game
            This creates the game object, then moves the user into the wait01 screen
        */
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

        /*
            FIRED: when user joins a room
            Moves user to wait01, and updates list for all users
        */
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
                        //console.log (x + " " + uid);
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
             Categories.find('', function(data, categories) { 
                res({ 
                    categories: 
                        categories 
                }); 
            }) 
        });

        function getUser() {
            return user;
        }

        function validRoomNumber(){
            var num = (Math.random()*10000) | 0;
            var found = running_games[num]; 
            if(found){ 
                return validRoomNumber(); 
            }
            else{
                return num;
            }        
        }
    });// end on connection event

// function getQuestions(categories){
//     Questions.findOne({},function(err,data){
//         console.log(data);
//     })
//                 var gm = running_games[user.roomname];
//             var temp = gm.category;
//             var questions = [];
//     var questions[]
//     for(var i = 0; i < temp.length; i += 1){
//         questions.push(Questions.findOne().$where(gm.category[i].categoryName))
//     }
//     return questions
// }

    function getrandomroom() 
    {
        //create random int
        if(runninggames.contain(randomenumber))
        {
            randomenumber = getrandomroom();
        }
        return randomenumber;
    }

    function sleep(milliSeconds){
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    }
    //sleep(10000);

    };