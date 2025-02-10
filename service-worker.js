let playing = false;
let reset = true;
let total_time = 0;
let intervalID = 0;

// function that increments the script's clock by 1
function incrementTime(){
    total_time += 1;
    if (total_time%10==0){
        console.log(total_time);
    };
}

// called when the script receives a play message from the content script. Starts an 'interval' that repeatedly calls incrementTime every 100ms
function handlePlay(){
    // increment total_time by 1 every 10th of a second
    intervalID = setInterval(incrementTime, 100);
    playing = true;
    reset = false;
}

// called when the script receives a pause message from the content script. Stops the interval set by handlePlay
function handlePause(){
    clearInterval(intervalID);
    console.log("interval cleared");
    playing = false;
    reset = false;
}

// called when the script receives a stop message from the content script. Resets the script's clock
function handleStop(){
    playing = false;
    reset = true;
    total_time = 0;
}

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
            console.log("current state in the service-worker file, before posting msg: ", [playing, reset, total_time]);
            port.postMessage({type: "state_response", content: [playing, reset, total_time]});

        }else if (msg.type === "play"){

            // if a play message is received, call handlePlay
            console.log("calling handlePlay")
            handlePlay();

        }else if (msg.type === "pause"){

            // if a pause message is received, call handlePause
            console.log("calling handlePause");
            handlePause();

        }else if (msg.type === "stop"){

            // if a stop message is received, call handleStop
            console.log("calling handleStop");
            handleStop();
            let activity_text = msg.activity_text;
            let msgtotal_time = msg.total_time;
            chrome.storage.local.set({ [activity_text]: msgtotal_time }).then(() => {
                console.log("Key", activity_text, "has been stored alongside value", msgtotal_time);
              });
    
        }else{
            console.log("Invalid message type in port");
        }
    });
});
// end

// code to help keep service worker running and stop it terminating after 30 seconds of inactivity
async function createOffscreen() {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['BLOBS'],
      justification: 'keep service worker running',
    }).catch(() => {});
}
chrome.runtime.onStartup.addListener(createOffscreen);
self.onmessage = e => {}; // keepAlive
createOffscreen();

// end
