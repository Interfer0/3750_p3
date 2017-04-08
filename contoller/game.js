
exports.Game = class Game{

    constructor(roomname,category,players,gamerounds){

        this.roomname = roomname;
        this.category = category;
        this.players = players;
        this.gamerounds = gamerounds;
        this.users = [];
        this.round = 1;
        this.roundquestion = {};
        this.answers = [];

    };

    cnslPrint(){
        console.log("worked");
    }

    createGame(req, res){
        console.log("Game creation has been initialized");
        gameRounds = req.rounds;
    }

    pickquestion(sio,req, res){
        this.roundquestion = "Where am I?";// this needs to get the question from db in its scheme BSON

        
        //update all users to createAnswer screen

        for( var i = 0, len = this.users.length; i<len; i++)
        {
            this.users[i].screen = "answering";
        }
        res({question:this.roundquestion});
    }

    addUserToRoom(socket, username, ret){
        //console.log(socket);
       
        socket.join(this.roomname);
        //socket.to(user.roomid).emit(function_name);
        //socket.to(this.roomname).emit(username + " has join the game.");

        var found = this.users.some(function (el){
            return el.user === username;
        })
        if(!found)
        {
            this.users.push({
                user:username, 
                screen:"wait1", 
                socketID:socket.id
            });
        }
        console.log(username + " has joined " + this.roomname);
        socket.to(this.roomname).emit('updateUsers', {users : this.users});
        ret(this.users);
    }

    randomHost(response){
        var x = this.users.length;
        //if(x > 1 && gameRounds > 0){
            var host = this.users[Math.floor(Math.random() * x)];
            return host.user;
        //}else{
        //    return "wait for more players";
        //}
    }

    saveUsersAnswer(req, username)
    {
        var myUser;
        var found = this.users.some(function (el){
            if(el.user === username)
            {   
                myUser = el;
                return true;
            } else {
                return false;
            }
        })
        if(found)
        {
            this.answers.push({user:username,answer:req.answer,pickedanswer:"", score:0});
        }
        myUser.screen = "wait2";
    }

    wait2status(sio,user){
        //broadcase all usernames in wait2
        var inWait2 = [];
        this.users.some(function (el){
            if(el.screen == "wait2")
            {
                inWait2.push(el);
            }
        });
        sio.to(this.roomname).emit('usersInWait', {users:inWait2});
        
    }

    randomPlayerContinue(sio,userid, response){
        console.log("randomPayerContinue")
        this.currentPlayer = userid;
       sio.to(this.roomname).emit('gotoPickQuestion', {user:userid});
    }

    countRounds(){
        gameRounds = gameRounds - 1;
    }

   displayQuestion(){ 
        socket.emit() 
    } 

    getQuestions(Categories, Questions)
    {
        
    }

    moveUserToWait2(io)
    {

    }

    setRoom(username, screen)
    {
        for(var i = 0;i < this.users.length; i++)
        {
            console.log(username + " " + this.users[i].user);
            if(username == this.users[i].user)
            {
                this.users[i].screen = screen;
            }
        }
        console.log(this.users);
    }

    isUserPicking(sio, user, inquestion)
    {   
        let pug = require('pug');
        console.log(user);
        console.log(inquestion);
        this.users.some(function (el){
            console.log(el);
            if(el.screen == "questionpick")
            {   
                //set game question
                sio.to(this.roomname).emit('gotoAnswer', {
                    question:
                        inquestion,
                    page: 
                        pug.renderFile('views/includes/requestAnswers.pug')
                });
            }
        });
        
    }

};
