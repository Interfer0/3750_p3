
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

    createGame(req, res,user){
        console.log("Game creation has been initialized");
        gameRounds = req.rounds;
    }

    pickquestion(sio,req,user, res){
        this.roundquestion = req.question;
        //update all users to createAnswer screen
        for( var i = 0, len = this.users.length; i<len; i++)
        {
            this.users[i].screen = "requestAnswers";
        }
        res({question:this.roundquestion});
        this.answeringTimeout(sio, user.username, user.roomname, this.roundquestion,this);
        //answeringTimeout(sio, user.username, user.roomname, this.roundquestion,this);
    }

    addUserToRoom(socket, username, ret){       
        socket.join(this.roomname);

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
            var host = this.users[Math.floor(Math.random() * x)];
            return host.user;
    }

    saveUsersAnswer(req, username)
    {
        for(var i = 0;i < this.users.length; i++)
        {
            if(username == this.users[i].user)
            {
                this.answers.push({user:username,answer:req.answer,pickedanswer:"", score:0});
            }
        }
    }

    wait2status(sio,user){
        let pug = require('pug');
        //change users screen to wait2
        this.setRoom(user.username, "wait2");
        //broadcase all usernames in wait2
        var inWait2 = [];
        this.users.some(function (el){
            if(el.screen == "wait2")
            {
                inWait2.push(el);
            }
        });
        sio.to(this.roomname).emit('usersInWait', {users:inWait2});
        //if all users in wait2 then move all users to pickBestAnswer
        var allUsersInWait2 = true;
        for(var i = 0; i < this.users.length; i++)
        {
            if(this.users[i].screen != "wait2")
            {
                allUsersInWait2 = false;
            }
        }
        if(allUsersInWait2)
        {
            var shuffledAnswers = this.shuffle(this.answers);
            sio.to(this.roomname).emit('gotopickBestAnswer', {
                        question:
                            this.roundquestion,
                        page: 
                            pug.renderFile('views/includes/pickBestAnswer.pug'),
                        answers:
                            shuffledAnswers
                    });
        }

        
    }

    randomPlayerContinue(sio,userid, response){
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

            if(username == this.users[i].user)
            {
                this.users[i].screen = screen;
            }
        }
    }

    questionPickingTimeout(sio, user, roomname, question)
    {   

        let pug = require('pug');
        setTimeout(function(io,user,roomname,question,gm){

            gm.users.some(function (el){

                if(el.screen == "questionpick")
                {   

                    gm.rounquestion = question;
                    gm.roundA
                    //set game question
                    for(var i = 0; i< gm.users.length; i++)
                    {
                        gm.users[i].screen = "requestAnswers";
                    }

                    sio.to(roomname).emit('gotoAnswer', {
                        question:
                            question,
                        page: 
                            pug.renderFile('views/includes/requestAnswers.pug')
                    });
                    gm.answeringTimeout(sio, user, roomname, question,gm);

                }
            });
        },30000,sio,user,roomname,question,this);
    }

    answeringTimeout(sio, user, roomname, question,gm)
    {
        let pug = require('pug');
        
        //set the timer for answering
        setTimeout(function(io,user,roomname,question,gm){
            //if any users are in answering stage, move all users to the pickbestAnswer
            //in no users in this stage, do nothing
            gm.users.some(function (el){

                if(el.screen == "requestAnswers")
                {   
                    //set game question
                    var shuffledAnswers = gm.shuffle(gm.answers);
                    gm.roundquestion = question;
                    for(var i = 0;i < gm.users.length; i++)
                    {
                            gm.users[i].screen = "pickBestAnswer";
                    }
                    sio.to(roomname).emit('gotopickBestAnswer', {
                        question:
                            question,
                        page: 
                            pug.renderFile('views/includes/pickBestAnswer.pug'),
                        answers:
                            shuffledAnswers
                    });
                    
                    //answeringTimeout(sio, user, roomname, question);
                }
            });
        },30000,sio,user,roomname,question,gm);
    }

    //Fisher-Yates shuffle found 
    //http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
    shuffle(array) 
    {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }



};
