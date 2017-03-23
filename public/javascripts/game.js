
$(document).ready(function () {
    // let usersOnline = [];
    socket = io.connect('http://localhost:3000');
    let chatForm = $('#chatForm');
    let message = $('#chatInput');
    let chatWindow = $('#chatWindow');
    let username = '';
    let usersul = $('#userList');
    let error = $('#error');
    let users = [];

    chatForm.on('submit', function(e){
            e.preventDefault(); // prevent actual form submission
            socket.emit('c2smsg', message.val());
                if(message.val().length == 0){
                    return false;
                }
            chatWindow.append('<strong>You:</strong> ' + message.val() + '<br>');
            chatWindow.animate({
                scrollTop: chatWindow[0].scrollHeight
            }, 1000);
            message.val('');
            return false;
    });
    
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
        socket.emit('getUser');
        socket.emit('getUsers');
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
        scrollChatWindow();
    });

    socket.on('userLoggedIn', (data) => {
        chatWindow.append('<span class="pull-right login"><strong>' + data + '</strong> joined the chat room</span><br>');
        usersul.append('<h3 class="conversation padding" id="' + data + '">' + data + '</h3>');
        scrollChatWindow();
    });

    function scrollChatWindow() {
        chatWindow.animate({
            scrollTop: chatWindow[0].scrollHeight
        }, 1000);
    }


    
});
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
        
    }
    
    
    function newGameRoom()
    {   
        //this won't work? If we are not in any room yet. But it may work actually. 
        socket.emit('newGameRoom',"",function(response) {
            document.getElementById('gameMat').innerHTML = response; 
        })

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
        //prepare the information 

        //send the information handle return

                //handle failure
                //redirect to waiting if successful

    };



    //join room
    function joinRoom()
    {
        $.ajax({
            type: "POST",
            url: "/game/joinRoom",
            contentType: 'application/json',
            data: JSON.stringify({room : document.getElementById('roomInput').value}),
            dataType: "json",
            success: function (response)
            {
                document.getElementById('gameMat').innerHTML = response; 
            },
            error : function (response, e)
            {
                console.log("reee");
            }

        })
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

