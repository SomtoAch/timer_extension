# timer-chrome-extension
A repository containing the code that goes into making a chrome extension. I will be making a chrome extension that allows the user to track the passing of time.

## [Chrome Webstore Link](https://chromewebstore.google.com/detail/simple-timer/nepbojhapiicaiklcgbhcieldmglnlpn)

## Requirements
- Be downloadable on the Chrome Web Store
- Have an appealing design
- Allow user to start, pause and stop a timer with the use of 3 buttons
- display the amount of time passed since the timer was started
- allow the user to detail what they were doing during the duration of the timer
- allow the user to store the time session and description, to view later

For now I will focus on the first 4 features

### 03/01/2025
- Created and added images for the buttons
- Added event listeners to each button, and created the relevant functions for each button
The timer is now fully functional whilst the popup stays open. This is not optimal of course, the timer would be much more useful if it continued incrementing with the popup closed.

#### Buttons display flow
- start: playing=false, reset=true, pauseBTN and stopBTN hidden
- playBTN pressed -> playing=true, reset=false, pauseBTN unhidden, playBTN hidden, stopBTN hidden
- pauseBTN pressed -> playing=false, reset=false, playBTN unhidden, pauseBTN hidden, stopBTN unhidden
- stopBTN pressed -> playing=false, reset=true, playBTN unhidden, pauseBTN hidden, stopBTN hidden

### 06/01/2025
The timer is functional and available on the Chrome Web Store. Users can write down what they are timing, but there is no association with the recorded time, as the recorded time periods are not stored. The user can start the timer, but if they click anywhere outside the extension ( on the omnibar to make a search for example ) the extension's popup disappears and the timer with it.

I want to fix both of these problems with a sidebar, where previous time periods will be displayed, and where started timers will be displayed.