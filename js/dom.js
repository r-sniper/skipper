var skippingEnabled = false;
var currentSkipIndex = 0;
var lines = [];
var nextLine;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
    if (request.requestType == "timestamps") {
        // console.log("message received");
        console.log(request.lines);
        lines = request.lines;
        nextLine = getNextSkippingTimestamp();
        skippingEnabled = true;
        sendResponse({ dom: "received" });
    }
});

window.onload = () => {
    let videoPlayer = document.getElementsByClassName('video-stream html5-main-video')[0];
    let skipped = false;
    videoPlayer.addEventListener("timeupdate", () => {
        let currentTime = videoPlayer.currentTime;
        if (skippingEnabled) {
            if (skipped) {
                nextLine = getNextSkippingTimestamp();
                skipped = false;
            }
            let startTime = nextLine.start.timeInSeconds;
            let endTime = nextLine.end.timeInSeconds;
            console.log("currentTime: " + currentTime + " start: " + startTime+ " end: " + endTime);
            if (currentTime >= startTime && currentTime <= endTime) {
                videoPlayer.currentTime = endTime;
                skipped = true;
                console.log("skipped");
            }
            // console.log(getNextSkippingTimestamp());

        }
    });
};


const getNextSkippingTimestamp = function () {
    let nextLine = lines[currentSkipIndex];
    currentSkipIndex++;
    return nextLine;
}