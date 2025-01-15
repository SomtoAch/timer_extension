let playing;
let reset;
let total_time;
let seconds;
let minutes;
let intervalID;
let current_state;
const pauseBTN = document.getElementById('pauseBTN');
const playBTN = document.getElementById('playBTN');
const stopBTN = document.getElementById('stopBTN');
const timerText = document.getElementById('timerText');
const main = document.getElementById('main');
const darkToggle = document.getElementById('darkToggle');
const darkToggleLabel = document.getElementById('darkToggleLabel');
const activityText = document.getElementById('activityText');
const sidePanelButton = document.getElementById('openSidePanel');

window.onload = () => {
    console.log('onload');

    getCurrentState().then((current_state) => {
        console.log(current_state);
        playing = current_state[0];
        reset = current_state[1];
        total_time = current_state[2];
    })
    

    total_seconds = Math.round(total_time / 10);
    seconds = total_seconds % 60;
    minutes = Math.floor(total_seconds / 60);
    timerText.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    console.log("time retrieved and set");

    if(playing){
        intervalID = setInterval(incrementTime, 100);
        playBTN.classList.add("hide");
        pauseBTN.classList.remove("hide");
        stopBTN.classList.add("hide");
    }else if (!playing && !reset){
        playBTN.classList.remove("hide");
        pauseBTN.classList.add("hide");
        stopBTN.classList.remove("hide");
    }else if (reset){
        playBTN.classList.remove("hide");
        pauseBTN.classList.add("hide");
        stopBTN.classList.add("hide");
    } else{
        console.log("Error in playing & reset configuration");
    }

    pauseBTN.classList.add('hide');
    stopBTN.classList.add('hide');
    playBTN.classList.remove('hide');
    pauseBTN.addEventListener("click", pressPauseBTN);
    playBTN.addEventListener("click", pressPlayBTN);
    stopBTN.addEventListener("click", pressStopBTN);
    darkToggle.addEventListener("click", toggleDarkMode);
    sidePanelButton.addEventListener("click", openSidePanel);
}

async function getCurrentState(){
    const r = chrome.runtime.sendMessage({type: 'current_state'});
    console.log("r", r);
    return r;
}

function incrementTime(){
    total_time += 1;
    total_seconds = Math.round(total_time / 10);
    seconds = total_seconds % 60;
    minutes = Math.floor(total_seconds / 60);
    timerText.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

async function openSidePanel(){
    const window_data = await chrome.windows.getCurrent();

    const response = await chrome.runtime.sendMessage({type:"open_side_panel", window_id: window_data.id});
    // do something with response here, not outside the function
    window.close();
}

function toggleDarkMode(){
    main.classList.toggle('darkMode');
    timerText.classList.toggle('darkMode');
    timerText.classList.toggle('darkMode');
    darkToggleLabel.classList.toggle('darkMode');
    activityText.classList.toggle('darkMode');
}

function pressPlayBTN(){
    console.log('play pressed');
    intervalID = setInterval(incrementTime, 100);
    playing = true;
    reset = false;
    playBTN.classList.add("hide");
    pauseBTN.classList.remove("hide");
    stopBTN.classList.add("hide");

    chrome.runtime.sendMessage({type: 'play'});

    console.log('bottom reached');
}

function pressPauseBTN(){
    clearInterval(intervalID);
    playing = false;
    reset=false;
    pauseBTN.classList.add('hide');
    playBTN.classList.remove('hide');
    stopBTN.classList.remove('hide');

    chrome.runtime.sendMessage({type: 'pause'});
}

function pressStopBTN(){
    total_time = 0;
    seconds = total_time % 60;
    minutes = Math.floor(total_time / 60);
    timerText.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    playing=false;
    reset = true;
    stopBTN.classList.add('hide');

    chrome.runtime.sendMessage({type: 'stop'});
}