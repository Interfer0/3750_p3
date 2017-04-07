
//$(document).ready(function () {
    // let usersOnline = [];
    socket = io.connect('http://localhost:3000');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let username = '';
    let usersul = $('#userList');
    let error = $('#error');
    let users = [];
    let curScreen = "wait1";
    socket.emit('connect');
    document.getElementById('gameMat').innerHTML = '';
    document.getElementById('gameMat').innerHTML = initialGameScreen();
    

    function initialGameScreen(rtn){
        
        //get the initial display screen and load it into gameMat
        $.get("/game/initialGameRoom",function(res){
                document.getElementById('gameMat').innerHTML = res;  
                socket.emit('whoami',"", function (data) {
                    username = data.usr;
                });          
            }
        );
    }

    socket.on('whoami', data => {
        username = data.username;
    });

    socket.on('connect', function (data) {
        socket.emit('connected', (res) => {
            
        });
    });

    socket.on('s2cmsg', function (data) {
        //check message to determine what to do with it
        chatWindow.append('<strong>' + data.person + ':</strong> ' + data.message + '<br>');
        scrollChatWindow();
    });

    socket.on('userList', function (data) {
        let html = '';
        data.sort();
        for(let i = 0; i < data.length; i++){
            while(data[i] == data[i+1] && i < data.length-1){ // this makes so that users are not listed twice
                i++;
            }
            html += '<h3 class="conversation padding" id="' + data[i] + '">' + data[i] + '</h3>';
        }
        // let i = 0;
        // for (let i = 0; i < data.length; i++) {
        //     html += '<h3 class="conversation padding" id="' + data[i] + '">' + data[i] + '</h3>';
        // }
        usersul.append(html);
    });

    socket.on('userLoggedOut', (data) => {
        chatWindow.append('<span class="pull-right logout"><strong>' + data + '</strong> left the chat room</span><br>');
        $("#" + data).remove();
       // scrollChatWindow();
    });

    socket.on('userLoggedIn', (data) => {
        chatWindow.append('<span class="pull-right login"><strong>' + data + '</strong> joined the chat room</span><br>');
        usersul.append('<h3 class="conversation padding" id="' + data + '">' + data + '</h3>');
        scrollChatWindow();
    });

    socket.on('updateUsers', (data) => {
        //console.log(data);
        updatewaitlist(data.users);
    })

    socket.on('gotoPickQuestion', (data) => {
        //console.log(username + " | " + data.user);
        if(data.user == username)
        {
            var button = document.createElement("button");
            button.id = "continueToPickButton";
            button.className = "btn-info";
            button.innerHTML = "Pick Question!";
            var Elem = document.querySelector('#continueToPick');
            Elem.appendChild(button);
        }
    });

    socket.on('gotoAnswer', (data) => {
        console.log(data);
        document.getElementById('gameMat').innerHTML = data.page;
        document.querySelector("#question") .innerHTML = data.question;
    });
    /*
    function displayQuestionandAnswer()
    {
        socket.emit('displayQuestionandAnswer',"",function(res){
            document.getElementById('question').innerHTML = res.question;
        });
    };*/

    //display Questions 
    function selectQuestion(data){ 
        console.log("select a question from the list") 
    } 
 
    //send picked question 
    function clickedQuestion(){ 
        console.log("return selected question"); 
        socket.emit('displayQuestion', displayQuestion); 
    } 

    //receive picked question 
    function displayQuestion(data){ 
 
    } 


    
//});
$(document).on("click", "#submitRoomNumber", joinRoom);
$(document).on("click", "#newGameButton", newGameRoom);
$(document).on("click", "#newGameSubmitButton", startNewGame);
$(document).on("click", "#cancelQuestions", cancelNewGame);
$(document).on("click", "#continueToPickButton", continueToPickButton);

//#cheatToQuestDisplay should be changed to any button pressed for a question
//That click will then take the question, or question id and return it to the server
//This will cause all users to advance to the next page
$(document).on('click', "#cheatToQuestDisplay", toQuestDisplay);  
$(document).on('click', "#manageQuestions", toManage);
var socket;

    function toManage()
    {
         window.location.href = '/select';
    } 

    function toQuestDisplay()
    {
        socket.emit('questionpicked', {question:"What is your favorite Color?", questionid:012});
    }

    function continueToPickButton()
    {
        socket.emit('continueToPickclick',"",function(response) {
            document.getElementById('gameMat').innerHTML = response.page; 
        });
    }

    //get catagories
    function getCatagories()
    {
        socket.emit('getCats',"",function(response) {
            document.getElementById('CatList ').innerHTML = response; 
        });

    }
    
    
    
    function newGameRoom()
    {   
        //this won't work? If we are not in any room yet. But it may work actually. 
        socket.emit('newGameRoom',"",function(res) {
            document.getElementById('gameMat').innerHTML = res.page;
            document.querySelector("#roomInput").value = res.roomid; 
        });

    };

    function cancelNewGame()
    {
        $.get("/game/initialGameRoom",function(res){
                document.getElementById('gameMat').innerHTML = res;            
            }
        );
    }
    


    //send new game info
    function startNewGame()
    {
        var roomname = document.getElementById('roomInput').value; //string of desired roomname;
        var playerInput = document.getElementById('playerInput').value; //int of # of players
        var numberofgames = document.getElementById('gamesInput').value; //int of # of games
        var catInput = [];
        for(aaa in catInput){ //a array of all categories selected
            catInput.push("fdgs");
        }
        socket.emit("createNewGame",{
            "roomname" : roomname,
            "players" : playerInput,
            "gamerounds" : numberofgames,
            "category" : catInput
        }, function (res){
            //handle failure
            if(res.status == 200)
            {   
                document.getElementById('gameMat').innerHTML = res.page; 
                updatewaitlist(res.users, res.stage);
                updateTitle(res.room);
            }
        });

    };



    //join room
    function joinRoom()
    {
        socket.emit('joinRoom',{room : document.getElementById('roomInput').value}, function(res){
            if(res.status == 200)
            {
                document.getElementById('gameMat').innerHTML = res.page;   
                updatewaitlist(res.users, res.stage);
                updateTitle(res.room);
            }
            //if room does not exist

            //if room full

            //if join accepted

        });
    }

    function updatewaitlist(users){
        //console.log(users);
        var myElem = document.querySelector('#playerlist');
        while(myElem.firstChild) {
            myElem.removeChild(myElem.firstChild);
        }

        if (myElem != null){
            for( var e in users){
                //console.log(curScreen + users[e].screen);
                if(curScreen == users[e].screen)
                {
                    var div = document.createElement('div',users[e].user);
                    div.innerHTML = users[e].user;
                    myElem.appendChild(div);
                }
            }
        }
    };

    function updateTitle(room)
    {
        var myElem = document.querySelector('#roomnametitle');
        myElem.innerHTML = room;
    }
    
    //wait in new room
    
    //add new user 
        //if new room full add continue button
    //receive/display categories
    //send picked question
    //receive picked question
    //send answer
        //wait
    //receive/pick answers answers
    //send picked 
        //wait
    //recieve/display answers/scores
    //send continue
    //Display final scores
    //send continue
    //main screen

