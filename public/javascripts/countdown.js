var time = 30;
var html = document.getElementById("timer");

var timer = setInterval(countdown,1000);

function countdown(){
    if(time == 0){
        clearTimeout(timer);
    }else{
        html.innerHTML = time;
        time --;
    }
}