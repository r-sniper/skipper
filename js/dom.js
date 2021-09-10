const CURRENT_TIME_STATE = {
    BEFORE: "BEFORE",
    BETWEEN: "BETWEEN",
    AFTER: "AFTER",
}

var skippingEnabled = false;
var currentSkipIndex = 0;
var skipLines = [];
var nextSkipLine;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.requestType == "timestamps") {
        // console.log("message received");
        console.log(request.lines);
        skipLines = request.lines;
        nextSkipLine = getNextSkippingTimestamp();
        skippingEnabled = true;
        sendResponse({dom: "received"});
    }
});

const getCurrentTimeState = function (startTime, endTime, currentTime) {
    if (currentTime < startTime) {
        return CURRENT_TIME_STATE.BEFORE;
    }
    if (currentTime >= endTime) {
        return currentTime.AFTER;
    }
    return currentTime.BETWEEN;
}


window.onload = () => {
    let videoPlayer = document.getElementsByClassName('video-stream html5-main-video')[0];
    let skipped = false;
    videoPlayer.addEventListener("timeupdate", () => {
        let currentTime = videoPlayer.currentTime;
        if (skippingEnabled) {
            if (skipped) {
                nextSkipLine = getNextSkippingTimestamp();
                skipped = false;
            }
            let startTime = nextSkipLine.start.timeInSeconds;
            let endTime = nextSkipLine.end.timeInSeconds;
            console.log("currentTime: " + currentTime + " start: " + startTime + " end: " + endTime);

            let currentTimeSate = getCurrentTimeState(startTime, endTime, currentTime);

            if (currentTimeSate == CURRENT_TIME_STATE.BETWEEN) {
                videoPlayer.currentTime = endTime;
                skipped = true;
            }
            /* TODO: This is a scenario where user manually seeks the video forward
            * This would not work in the below mentioned scenarios
            * 1. If user goes back in time, skipping would not work
            * 2. If user goes too forward in time, might miss some skipping
            * Suggestion, get the exact skipping line based on the current timestamp
            * */
            if (currentTimeSate == CURRENT_TIME_STATE.AFTER) {
                nextSkipLine = getNextSkippingTimestamp();
            }

        }
    });
};


const getNextSkippingTimestamp = function () {
    let nextLine = skipLines[currentSkipIndex];
    currentSkipIndex++;
    return nextLine;
}