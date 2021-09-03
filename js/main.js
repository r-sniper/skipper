let uploadFileButton = document.getElementById("uploadedFileButton");

uploadFileButton.addEventListener("click",() => {
    let uploadedFile = document.getElementById("uploadFile").files[0];
    console.log(uploadedFile.name);
    console.log(uploadedFile);
});
