let window_Id = 0;
let playing = false;
let reset = true;
let intervalID = 0;
let total_time = 0;


function incrementTime(){
    total_time += 1;
}

function handlePlay(){
    intervalID = setInterval(incrementTime, 100);
    playing = true;
    reset = false;
}

function handlePause(){
    clearInterval(intervalID);
    playing = false;
    reset=false;
}

function handleStop(){
    total_time = 0;
    playing=false;
    reset = true;
}

// to receive messages from popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {

        console.log("chrome.runtime.windowIds");

        if (message.type === 'open_side_panel') {
            // This will open a window-specific side panel only on the current window.
            await chrome.sidePanel.open({ windowId : message.window_id });

        } else if(message.type === 'play'){
            handlePlay();

        } else if(message.type === 'pause'){
            handlePause();

        } else if(message.type === 'stop'){
            handleStop();

        } else if(message.type === 'current_state'){
            return [playing, reset, total_time];
        };

        return true;
    })();
  });