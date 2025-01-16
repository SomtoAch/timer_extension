let playing = false;
let reset = true;
let total_time = 0;
let current_state = ["is", "this", "working?"];

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

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name === "currentStatePort");
    port.onMessage.addListener(function(msg) {
        if (msg.type === "request")
            port.postMessage({type: "response", content: current_state});
        else if (msg.type === "response")
            current_state = msg.content;
    });
});