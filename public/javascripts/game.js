
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
    socket.emit('connect');
    document.getElementById('gameMat').innerHTML = '';
    document.getElementById('gameMat').innerHTML = initialGameScreen();
    

    function initialGameScreen(rtn){
        //get the initial display screen and load it into gameMat
        $.get("/game/initialGameRoom",function(res){
                document.getElementById('gameMat').innerHTML = res;            
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
        console.log(data);
        updatewaitlist(data.users);
    })

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

var socket;
//moving this here instead of on ready. 
//Had to do this since I need to work with buttons and elements that are handled
//after the initial page load. 

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
        socket.emit('newGameRoom',"",function(response) {
            document.getElementById('gameMat').innerHTML = response; 
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

    function updatewaitlist(users, curScreen){
        
        var myElem = document.querySelector('#playerlist');
        while(myElem.firstChild) {
            myElem.removeChild(myElem.firstChild);
        }

        if (myElem != null){
            for( var e in users){
                console.log(curScreen + "  " + users[e].screen)
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

