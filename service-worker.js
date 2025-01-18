let playing = false;
let reset = true;
let total_time = 0;
let current_state = [playing, reset, total_time];
let intervalID = 0;

function incrementTime(){
    total_time += 1;
    if (total_time%10==0){
        console.log(total_time);
    };
}

function handlePlay(){
    // increment total_time by 1 every 10th of a second
    intervalID = setInterval(incrementTime, 100);
    playing = true;
    reset = false;
}

function handlePause(){
    clearInterval(intervalID);
    console.log("interval cleared");
    playing = false;
    reset = false;
}

function handleStop(){
    playing = false;
    reset = true;
    total_time = 0;
}

// to find the windowId of the active tab
let window_Id = 0;

// to receive messages from popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {

        if (message.type === 'open_side_panel') {
            // This will open a window-specific side panel only on the current window.
            await chrome.sidePanel.open({ windowId : message.window_id });
        };
        return true;
    })();
  });

// persistent port connection event listeners
// this block is triggered when a script sends a connection request
chrome.runtime.onConnect.addListener(function(port) {

    // create an event listener that activates when a message is received on the port
    port.onMessage.addListener(function(msg) {

        // if the msg has a type key with a value of request
        if (msg.type === "state_request"){

            // send a response message with the current state of the background timer as the content
            console.log("current state in the service-worker file, before posting msg: ", current_state);
            port.postMessage({type: "state_response", content: current_state});

        }else if (msg.type === "play"){

            // if a play message is received, call handlePlay
            handlePlay();

        }else if (msg.type === "pause"){

            // if a pause message is received, call handlePause
            console.log("calling handlePause");
            handlePause();

        }else if (msg.type === "stop"){

            // if a stop message is received, call handleStop
            handleStop();
    
        }else{
            console.log("Invalid message type in port");
        }
    });
});