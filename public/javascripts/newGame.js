function init() {
    function textFieldValidate(event) {
       
        if(roomName.value === ""){
        roomName.style = "background-color:#99ff99";
        }
    }

$('#newGameSubmitButton').on('click', textFieldValidate);
}
$(document).on('ready', init);      