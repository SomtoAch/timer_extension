// to find the windowId of the active tab
let window_Id = 0;
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log(activeInfo.windowID);
});

// to receive messages from popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // The callback for runtime.onMessage must return falsy if we're not sending a response
    (async () => {

        console.log("chrome.runtime.windowIds");

        if (message.type === 'open_side_panel') {
            // This will open a window-specific side panel only on the current window.
            await chrome.sidePanel.open({ windowId : message.window_id });
        };
        return true;
    })();
  });