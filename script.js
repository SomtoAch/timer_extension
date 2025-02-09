var current_state = [];
var playing = false;
var reset = true;
var total_time = 0;
var total_seconds = 0;
var minutes = 0;
var seconds = 0;


// get document elements that may need to be manipulated during this script's runtime, and create some event listeners
const pauseBTN = document.getElementById('pauseBTN');
pauseBTN.addEventListener("click", pressPauseBTN);

const playBTN = document.getElementById('playBTN');
playBTN.addEventListener("click", pressPlayBTN);

const stopBTN = document.getElementById('stopBTN');
stopBTN.addEventListener("click", pressStopBTN);

const timerText = document.getElementById('timerText');
const main = document.getElementById('main');
const darkToggle = document.getElementById('darkToggle');

const darkToggleLabel = document.getElementById('darkToggleLabel');
darkToggle.addEventListener("click", toggleDarkMode);

const activityText = document.getElementById('activityText');

const sidePanelButton = document.getElementById('openSidePanel');
sidePanelButton.addEventListener("click", openSidePanel);
// end



// Open channel for communication with service worker. This port is specifically for exchanging data about the current state of popup, sidebar and background clocks
const port = chrome.runtime.connect({name: "port"});

// listen for messages on port. this is an event listener so only needs to be created once.
port.onMessage.addListener(async function(msg) {

    // if a state_response message is received, set current state to be the msg content, and change the playing, reset and total time values
    if (msg.type === "state_response"){

        console.log("getting current state");
        console.log(msg.content)
        current_state.push(...msg.content);
        playing = current_state[0];
        reset = current_state[1];
        total_time = current_state[2];
        total_seconds = Math.round(total_time / 10);
        seconds = total_seconds % 60;
        minutes = Math.floor(total_seconds / 60);
        timerText.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        console.log("Total time after state response: ", total_time);

        // if timer is stopped/ reset
        if (!playing&&reset){
            pauseBTN.classList.add("hide");
            stopBTN.classList.add("hide");
            playBTN.classList.remove("hide");

        // if timer is playing
        } else if(playing&&!reset){
            intervalID = setInterval(incrementTime, 100);
            playBTN.classList.add("hide");
            pauseBTN.classList.remove("hide");
            stopBTN.classList.add("hide");

        // if timer is paused
        } else if(!playing&&!reset){
            playBTN.classList.remove("hide");
            pauseBTN.classList.add("hide");
            stopBTN.classList.remove("hide");
        } else {
            console.log("Incorrect current state configuration");
        }
        // end
    }else{
        console.log("Invalid message type for the port connection between the service worker and content script");
    }
});
// end



// send a state request to the port. The response updates the current_state variable. Then use the values in the current state variable to create the playing, reset and total_time variables. Create th seconds and minutes variables using total_time, and update timerText with this data
port.postMessage({type: "state_request"});


// end




// if timer is stopped/ reset
if (!playing&&reset){
    pauseBTN.classList.add("hide");
    stopBTN.classList.add("hide");
    playBTN.classList.remove("hide");

// if timer is playing
} else if(playing&&!reset){
    playBTN.classList.add("hide");
    pauseBTN.classList.remove("hide");
    stopBTN.classList.add("hide");

// if timer is paused
} else if(!playing&&!reset){
    playBTN.classList.remove("hide");
    pauseBTN.classList.add("hide");
    stopBTN.classList.remove("hide");
} else {
    console.log("Incorrect current state configuration");
}
// end



// function that increments the total_time variable every 10th of a second. Calculates the required seconds and minutes and updates the timer text variable's inner HTML
function incrementTime(){
    total_time++;
    total_seconds = Math.round(total_time / 10);
    seconds = total_seconds % 60;
    minutes = Math.floor(total_seconds / 60);
    timerText.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// function that is called when user clicks the open Sidepanel button. 
async function openSidePanel(){
    var window_data = await chrome.windows.getCurrent();

    var response = await chrome.runtime.sendMessage({type:"open_side_panel", window_id: window_data.id});
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
    console.log('play pressed, total time:', total_time);
    port.postMessage({type: "play"});
    intervalID = setInterval(incrementTime, 100);
    playing = true;
    reset = false;
    playBTN.classList.add("hide");
    pauseBTN.classList.remove("hide");
    stopBTN.classList.add("hide");
    console.log('bottom reached');
}

function pressPauseBTN(){
    console.log("pause pressed");
    port.postMessage({type: "pause"});
    clearInterval(intervalID);
    playing = false;
    reset=false;
    pauseBTN.classList.add('hide');
    playBTN.classList.remove('hide');
    stopBTN.classList.remove('hide');
}

function pressStopBTN(){
    console.log("stop pressed");
    port.postMessage({type: "stop"});
    total_time = 0;
    seconds = total_time % 60;
    minutes = Math.floor(total_time / 60);
    timerText.innerHTML = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    playing=false;
    reset = true;
    stopBTN.classList.add('hide');
}