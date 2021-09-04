let uploadFileButton = document.getElementById("uploadFile");
var ready = false;
var result = null;
uploadFileButton.addEventListener("change", () => {
    let uploadedFile = document.getElementById("uploadFile").files[0];
    console.log(uploadedFile.name);
    console.log(uploadedFile);
    check(fileReader(uploadedFile));
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

var check = function () {
    if (ready === true) {
        console.log(result);
        let srt = new Srt(result);
        console.log(srt);
        return;
    }
    setTimeout(check, 1000);
}
