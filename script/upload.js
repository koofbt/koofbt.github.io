let stepNumber = 1;
let bearerToken;
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

    let x = window.location.href.split('/?q=')[1];

    bearerToken = window.location.href.split('/?q=')[1];

    document.addEventListener("DOMContentLoaded", () => {
        /**
        * Hide all form steps.
        */
        document.querySelectorAll(".form-step").forEach((formStepElement) => {
            formStepElement.classList.add("hidden");
        });

        localStorage.setItem('bearerToken', window.location.href.split('/?q=')[1]);

        fetchData();
        

        // document.querySelector("#step-" + stepNumber).classList.remove("hidden");

        }
    );

}

function changeCountry(country) {
    console.log(country.value);
}

async function fetchData() {

    const jwt = localStorage.getItem('bearerToken');

    document.querySelector('#msg1').innerHTML = jwt;
    let response = await fetch('https://dca.revadeep.xyz/api/v1/users/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': 'Bearer '+ jwt,
        }
      });
    
      if (response.ok) {
        
        document.querySelector('#msg').innerHTML = JSON.stringify(response);

        document.querySelector("#step-" + stepNumber).classList.remove("hidden");

      } else {

        document.querySelector("#step-" + stepNumber).classList.remove("hidden");
        document.querySelector('#msg').innerHTML = JSON.stringify(response);
      }


// fetchCountryList -> '/kyc/country_list'
// createKycAttempt -> '/kyc_aml_record/'
// fetchSupportedDocList -> '/kyc_aml_record/get_kyc_aml_documents/'
    
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