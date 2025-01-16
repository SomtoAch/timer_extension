let playing = false;
let reset = true;
let total_time = 0;
let seconds = 0;
let minutes = 0;
let intervalID = 0;
let current_state = [playing, reset, total_time];
const pauseBTN = document.getElementById('pauseBTN');
const playBTN = document.getElementById('playBTN');
const stopBTN = document.getElementById('stopBTN');
const timerText = document.getElementById('timerText');
const main = document.getElementById('main');
const darkToggle = document.getElementById('darkToggle');
const darkToggleLabel = document.getElementById('darkToggleLabel');
const activityText = document.getElementById('activityText');
const sidePanelButton = document.getElementById('openSidePanel');

// Open channel for communication with service worker and send a request for the current state of the service
var port = chrome.runtime.connect({name: "currentStatePort"});
port.postMessage({type: "request"});

port.onMessage.addListener(function(msg) {
  if (msg.type === "request")
    port.postMessage({type: "response", content: [playing, reset, total_time]});
  else if (msg.type === "response")
    console.log(msg.content);
    current_state = msg.content;
});

window.onload = () => {
    console.log('onload');
    pauseBTN.classList.add('hide');
    stopBTN.classList.add('hide');
    playBTN.classList.remove('hide');
    pauseBTN.addEventListener("click", pressPauseBTN);
    playBTN.addEventListener("click", pressPlayBTN);
    stopBTN.addEventListener("click", pressStopBTN);
    darkToggle.addEventListener("click", toggleDarkMode);
    sidePanelButton.addEventListener("click", openSidePanel);
}

function incrementSeconds(){
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