let stepNumber = 1;
let bearerToken;
var headers;
let countryList = [];
let supportedDocsList = [];
let stateList = [];


var imageCapture;
var mediaStream;

let livenessCheckBase64 = '';
let base64Text = '';
var videoLC = document.querySelector('#videoLVC');
const preview = document.querySelector("#imageSrc");

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

    const bearerToken = window.location.href.split('/?q=')[1];
    localStorage.setItem('bearerToken', bearerToken);

    fetchData();

    document.addEventListener("DOMContentLoaded", () => {
        if (stepNumber == 1) {
            document.querySelector('#backButton').classList.add("hidden");
        }

        /**
        * Hide all form steps.
        */

        document.querySelectorAll(".form-step").forEach((formStepElement) => {
            formStepElement.classList.add("hidden");
        });

    }
    );

}

async function fetchData() {

    const [countries, supportedDocs] = await Promise.all([fetchCountryList(), fetchSupportedDocList()])

    if (countries && supportedDocs) {
        countryList.push(...countries);
        supportedDocsList.push(...supportedDocs);

        document.querySelector("#step-" + stepNumber).classList.remove("hidden");
        var selectCountryList = document.querySelector("#country");

        for (let index = 0; index < countryList.length; index++) {
            const element = countryList[index];
            var option = document.createElement("option");
            option.value = element.name;
            option.text = element.name;
            selectCountryList.appendChild(option);
        }
    }
}

async function fetchCountryList() {

    const jwt = localStorage.getItem('bearerToken');
    let response = await fetch('https://dca.revadeep.xyz/api/v1/kyc/country_list/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + jwt,
        }
    });

    if (response.status == 200) {
        let json = await response.json();
        return json.data;
    } else {
        return;
    }
}

async function fetchSupportedDocList() {
    const jwt = localStorage.getItem('bearerToken');
    let response = await fetch('https://dca.revadeep.xyz/api/v1/kyc_aml_record/get_kyc_aml_documents/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': 'Bearer ' + jwt,
        }
    });

    if (response.status == 200) {
        let json = await response.json();
        return json.data;
    } else {
        return;
    }
}

function changeCountry(country) {
    getStatesFromCountry(country.value);
    getDocsFromCountry(country.value);
    if (country.value == 'Nigeria') {
        document.querySelector("#bvnField").classList.remove("hidden");
    } else if (country.value != 'Nigeria') {
        document.querySelector("#bvnField").classList.add("hidden");
    }
}

function getStatesFromCountry(country) {
    let countryObject = countryList.filter((el) => {
        return el.name == country;
    })[0];

    if (stateList.length != 0) {
        stateList = [];
    }

    stateList.push(...countryObject.states);

    var selectStateList = document.querySelector("#state");
    if (selectStateList.length != 0) {
        document.querySelectorAll('#state option').forEach(option => option.remove())
    }
    for (let index = 0; index < stateList.length; index++) {
        const element = stateList[index];
        var option = document.createElement("option");
        option.value = element.name;
        option.text = element.name;
        selectStateList.appendChild(option);
    }
}

function getDocsFromCountry(country) {

    let countryDocsObject = supportedDocsList.filter((el) => {
        return el.country == country.toLowerCase() || el.country == 'default';
    })[0];

    var selectDocTypeList = document.querySelector("#docType");

    if (selectDocTypeList.length != 0) {
        document.querySelectorAll('#docType option').forEach(option => option.remove())
    }
    for (let index = 0; index < countryDocsObject.document.length; index++) {
        const element = countryDocsObject.document[index];
        var option = document.createElement("option");
        option.value = element.document_type;
        option.text = element.display_text;
        selectDocTypeList.appendChild(option);
    }
}

function goToNextForm() {
    stepNumber = stepNumber + 1;

    /** Hide all form steps. */
    document.querySelectorAll(".form-step").forEach((formStepElement) => {
        formStepElement.classList.add("hidden");
    });

    document.querySelector("#step-" + stepNumber).classList.remove("hidden");
    document.querySelector('#backButton').classList.remove("hidden");

    livenessCheckInit();
}

function livenessCheckInit() {

    if (stepNumber == 3) {
        let randNum = Math.floor(Math.random() * 5) + 1;
        document.querySelector('#livenessCheckMsg').innerHTML = "Please hold " + randNum + " fingers up to the side of your face. Ensure the fingers are not covering your face.";

        const constraints = {
            video: {
                width: { min: 640, ideal: 1920 },
                height: { min: 400, ideal: 1080 },
                aspectRatio: { ideal: 1.7777777778 },
            },
            frameRate: { max: 30 },
            facingMode: { exact: "user" },
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((e) => {
                mediaStream = e;
                videoLC.srcObject = e;
                // video.classList.remove('hidden');
                imageCapture = new ImageCapture(e.getVideoTracks()[0]);
                console.log(e);
            })
            .catch(error => {
                console.log('getUserMedia error: ', error);
            });

    }





}
// Get a Blob from the currently selected camera source and
// display this with an img element.
 function takePhoto() {
    imageCapture.takePhoto().then(async function (blob)  {
        console.log('Took photo:', blob);
        videoLC.classList.add('hidden');
        const imageLivenessCheck = document.querySelector("#imageLVC");

        const compressedFile = await compressImage(blob, {
            // 0: is maximum compression
            // 1: is no compression
            quality: 0.4,
    
            // We want a JPEG file
            type: 'image/jpeg',
        });
    


        const captureBase64 = await toBase64(compressedFile);

        imageLivenessCheck.src = captureBase64;
        livenessCheckBase64 = captureBase64;

        imageLivenessCheck.classList.remove("hidden");
        // imageLivenessCheck.src = URL.createObjectURL(blob);
        // livenessCheckBase64 = URL.createObjectURL(blob);


        // const fileReader = getBase64(blob);

        // fileReader.onload = e => {
        //     videoLC.src = e.target.result;
        //     // livenessCheckBase64 = blob;
        // }
        // fileReader.onerror = function (error) {
        //     console.log('Error: ', error);
        // };

        if (imageLivenessCheck.src != '') {
            document.querySelector('#captureImg').classList.add('hidden');
            document.querySelector('#proceedPersonalInfo').classList.remove('hidden');
        }
    }).catch(function (error) {
        console.log('takePhoto() error: ', error);
    });
}

async function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    return reader;
}

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

async function previewFile() {
    const file = document.querySelector("#pickFile").files[0];

    const compressedFile = await compressImage(file, {
        // 0: is maximum compression
        // 1: is no compression
        quality: 0.4,

        // We want a JPEG file
        type: 'image/jpeg',
    });

    if (file) {
        const imageStr = await toBase64(compressedFile);
        preview.src = imageStr;
        base64Text = imageStr;

        // console.log(await toBase64(file));
        // const fileReader = getBase64(file);

        // fileReader.onload = e => {
        //     preview.src = e.target.result;
        //     console.log(e.target.result);
        //     // base64Text = e.target.result;
        //     // base64Text = file;
        //     base64Text = e.target.URL;
        // }
        // fileReader.onerror = function (error) {
        //     console.log('Error: ', error);
        // };
    }
}

const myTextbox = document.querySelector("#finalSubmit");
myTextbox.addEventListener("click", checkName, false);

const compressImage = async (file, { quality = 1, type = file.type }) => {
    // Get as image data
    const imageBitmap = await createImageBitmap(file);

    // Draw to canvas
    const canvas = document.createElement('canvas');
    canvas.width = imageBitmap.width;
    canvas.height = imageBitmap.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, 0, 0);

    // Turn into Blob
    return await new Promise((resolve) =>
        canvas.toBlob(resolve, type, quality)
    );
};

async function checkName(evt)  {
    const key = evt.key;
    evt.preventDefault();

    let payLoad = {
        "gender": document.querySelector('#gender').value.trim(),
        "document_number": document.querySelector('#docNumber').value.trim(),
        "bvn": document.querySelector('#bvn').value,
        "date_of_birth": new Date(document.querySelector('#dob').value).toLocaleDateString().replaceAll('/', '-'),
        "country": document.querySelector('#country').value,
        "state": document.querySelector('#state').value,
        "street_line_one": document.querySelector("#residentialAddress").value,
        "selfie": livenessCheckBase64,
        "photo_id": base64Text,
        'document_type': document.querySelector('#docType').value,
        "postal_code": document.querySelector('#postalCode').value,
        "politically_exposed_person": "True",
        "accept_terms": "True",
        "accept_data_usage_policy": "True",
      };
      
      const jwt = localStorage.getItem('bearerToken');

      document.querySelector('#loaderIcon').classList.remove('hidden');
      document.querySelector('#finalSubmit').classList.add('hidden');
      let response = await fetch('https://dca.revadeep.xyz/api/v1/kyc_aml_record/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json;charset=utf-8',
              'Authorization': 'Bearer ' + jwt,
          },
          body: JSON.stringify(payLoad),
      });
      document.querySelector('#loaderIcon').classList.add('hidden');
  
      if (response.status == 200) {
          let json = await response.json();
          window.location.href = 'https://koofbt.github.io/success.html'
          return json.data;
      } else {
            alert(response.message);
          return;
      }

}

hideAll();
