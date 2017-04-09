var submit = document.getElementById("newGameSubmitButton");
var roomName = document.getElementById("roomInput");

$(document).on("click", "newGameSubmitButton", textFieldValidate)

function textFieldValidate(){
        if(roomName.innerHTML == "")
            roomName.style.background = "#555555";



}