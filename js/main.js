let uploadFileButton = document.getElementById("uploadFile");
var ready = false;
var result = null;
var videoPlayer = null;


uploadFileButton.addEventListener("change", () => {
    let uploadedFile = document.getElementById("uploadFile").files[0];
    console.log(uploadedFile.name);
    checkFileReader(fileReader(uploadedFile));
    console.log("after check");
});

const fileReader = (file) => {
    let fr = new FileReader();
    fr.onload = () => {
        /* console.log(typeof fr.result);
        console.log(fr.result); */
        result = fr.result;
        ready = true;

    }
    fr.readAsText(file);
}

var checkFileReader = function () {
    if (ready === true) {
        console.log(result);
        let srt = new Srt(result);
        console.log(srt);
        sendSrt(srt);
        return;
    }
    setTimeout(checkFileReader, 1000);
}

var sendSrt = (srt) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // Send a request to the content script.
        console.log(tabs);
        chrome.tabs.sendMessage(tabs[0].id, { requestType: "timestamps", lines: srt.lines, url: tabs[0].url }, function (response) {
            console.log(response);
        });
    });
}
