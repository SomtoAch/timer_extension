let playing = false;
let reset = true;
let total_time = 0;
let seconds = 0;
let minutes = 0;
let intervalID = 0;
const pauseBTN = document.getElementById('pauseBTN');
const playBTN = document.getElementById('playBTN');
const stopBTN = document.getElementById('stopBTN');
const timerText = document.getElementById('timerText');

window.onload = () => {
    console.log('onload');
    pauseBTN.classList.add('hide');
    stopBTN.classList.add('hide');
    playBTN.classList.remove('hide');
    pauseBTN.addEventListener("click", pressPauseBTN);
    playBTN.addEventListener("click", pressPlayBTN);
    stopBTN.addEventListener("click", pressStopBTN);
}

function incrementSeconds(){
    total_time += 1;
    total_seconds = Math.round(total_time / 10);
    seconds = total_seconds % 60;
    minutes = Math.floor(total_seconds / 60);
    timerText.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function pressPlayBTN(){
    console.log('play pressed');
    intervalID = setInterval(incrementSeconds, 100);
    playing = true;
    reset = false;
    playBTN.classList.add("hide");
    pauseBTN.classList.remove("hide");
    stopBTN.classList.add("hide");
    console.log('bottom reached');
}

function pressPauseBTN(){
    clearInterval(intervalID);
    playing = false;
    reset=false;
    pauseBTN.classList.add('hide');
    playBTN.classList.remove('hide');
    stopBTN.classList.remove('hide');
}

function pressStopBTN(){
    total_time = 0;
    seconds = total_time % 60;
    minutes = Math.floor(total_time / 60);
    timerText.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    playing=false;
    reset = true;
    stopBTN.classList.add('hide');
}