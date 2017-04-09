
//$(document).ready(function () {
    // let usersOnline = [];
    var socket = io.connect('http://localhost:3000');
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
        document.getElementById('gameMat').innerHTML = data.page;
        document.querySelector("#question") .innerHTML = data.question;
    });

    socket.on('usersInWait',function(data)
    {
        var w2playerlist = document.querySelector('#Wait2playerlist');
        if(w2playerlist)
        {
            w2playerist.innerHTML="";
            for(var e in data.users){
                var div = document.createElement('div',data.users[e].user);
                div.innerHTML = data.users[e].user;
                w2playerlist.appendChild(div);
            }
        }
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
    function toQuestDisplay(id, question) 
    { 
        socket.emit('questionpicked', {questionid:id, question: question}); 
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
$(document).on('click', "#submitAnswer", submitAnswer)

    function submitAnswer()
    {
        var playerAnswer = document.querySelector('#playerAnswer').value;
        socket.emit('submitAnswer', {answer:playerAnswer}, function(response){
            document.getElementById('gameMat').innerHTML = response.page; 
        })
    }

 

    function toManage()
    {
         window.location.href = '/select';
    } 

    function toQuestDisplay(id, question)
    {
        socket.emit('questionpicked', {questionid:id, question: question});
    }


//Continue to work on displaying the questions.
    function continueToPickButton()
    {
        socket.emit('continueToPickclick',"",function(response) {
            document.getElementById('gameMat').innerHTML = response.page; 
            var myElement = document.querySelector('#questions');
            myElement.innerHTML = '<p>Testing adding HTML</p>';
            for(var i = 0; i < response.questions; i++){
                // var div = document.createElement('div');
                //     div.innerHTML = '<div><button id="' + response.questions[i].id +'" value="'+reponse.questions[i].question+'" onclick="toQuestDisplay()" /></div>';
                //     myElement.appendChild(div);
                myElement.innerHTML = '<p>' + response.questions[i] + '</p>';
            }
        });
    }

    function displayQuestions(){
        
    }

    //get catagories
    function getCatagories()
    {
        socket.emit('getCats',"",function(response) {
            document.getElementById('CatList').innerHTML = response; 
            
            var catlist = document.querySelector('#CatList' );
            for(var r in cats)
            {
                var option = document.createElement("option");
                option.text= cats[r].categoryName;
                option.value= cats[r]._is;
                catlist.add(option);
            }
            
        });

    }

  
    function chosenAnswer(req){
        socket.emit('chosenAnswer',req, function(data){
            document.getElementById('gameMat').innerHTML = res.page;
        });
    };
    
    function newGameRoom()
    {   
        //this won't work? If we are not in any room yet. But it may work actually. 
        socket.emit('newGameRoom',"",function(res) {
            document.getElementById('gameMat').innerHTML = res.page;
            document.querySelector("#roomInput").value = res.roomid; 
        });
        socket.emit('getCats', "", function(res){
            console.log(res);
            var catlist = document.querySelector('#CatList' );
            for(var r in res.categories)
            {
                var option = document.createElement("option");
                option.text= res.categories[r].categoryName;
                option.value= res.categories[r]._id;
                catlist.add(option);
            }
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
        
        var cats = document.querySelector('#myCatList').options;
        for(aaa in cats){ //a array of all categories selected
            if(!isNaN(aaa) && cats[aaa].value != "-1")
            {   
                catInput.push({_id:cats[aaa].value,categoryName:cats[aaa].text});
            }
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


function moveToMyList()
{
  var catlist = document.querySelector('#CatList');  
  var mycatlist = document.querySelector('#myCatList');
  if(catlist.options[catlist.selectedIndex].value != -1){
    mycatlist.add(catlist.options[catlist.selectedIndex]);
  }
  catlist.selectedIndex = -1;
  mycatlist.selectedIndex = -1;
}

function moveToList()
{
  var catlist = document.querySelector('#CatList');  
  var mycatlist = document.querySelector('#myCatList');
  if(mycatlist.options[mycatlist.selectedIndex].value != -1){
    catlist.add(mycatlist.options[mycatlist.selectedIndex]);
  }
  catlist.selectedIndex = -1;
  mycatlist.selectedIndex = -1;
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

