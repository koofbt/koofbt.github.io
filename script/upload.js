let stepNumber = 1;
var headers;

function goBack() {

    if (stepNumber > 1) {
        stepNumber = stepNumber - 1;
        /** Hide all form steps. */
        document.querySelectorAll(".form-step").forEach((formStepElement) => {
            formStepElement.classList.add("hidden");
        });
        document.querySelector("#step-" + stepNumber).classList.remove("hidden");
    }
}

function hideAll() {

    var req = new XMLHttpRequest();
req.open('GET', document.location, false);
req.send(null);
headers = req.getAllResponseHeaders().toLowerCase();
alert(headers);
document.querySelector('haders').addValue(headers);


    document.addEventListener("DOMContentLoaded", () => {
    /**
    * Hide all form steps.
    */
    document.querySelectorAll(".form-step").forEach((formStepElement) => {
        formStepElement.classList.add("hidden");
    });

    document.querySelector("#step-" + stepNumber).classList.remove("hidden");

    });

}

function changeCountry(country) {
    console.log(country.value);
}

hideAll();

window.onload = function()  { 

   


    
    
    
    
    // can also use window.addEventListener('load', (event) => {
    // alert('Page loaded');

    // image is loaded at this time
    // alert(`Image size: ${img.offsetWidth}x${img.offsetHeight}`);

    //Initialize video
    // const video = document.getElementById("video"); 

    // validate video element
    // if (navigator.mediaDevices.getUserMedia) {
    //     navigator.mediaDevices
    //         .getUserMedia({ video: true, facingMode: "user", exact: "user"})
    //         .then((stream) => {
    //             video.srcObject = stream;
    //         })
    //         .catch(function(error) {
    //             console.log(error);
    //             console.log("Something went wrong!");
    //         });
    // }
};




// function pickFileFromPhone() {
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";

//     input.click();
    
//     console.log(input.file);
//     const file = input.files[0];

//     // input.onchange = function () {
//     //     const reader = new FileReader();
//     //     reader.onloadend = function () {
//     //         console.log(reader.result);
//     //         // reader.result;

//     //     }




//     // };


//     return input;
// }

// function onPageLoad() {

//     const click = document.getElementById('cameraFileInput');
//     click.click();
//     // if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
//     //     console.log("Let's get this party started")
//     //     navigator.mediaDevices.getUserMedia();
//     //   }
// }

// onPageLoad();