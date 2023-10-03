let stepNumber = 1;
let bearerToken;
var headers;
let countryList = [];
let supportedDocsList = [];
let stateList = [];

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

    livenessCheckInit();


    document.querySelector("#step-" + stepNumber).classList.remove("hidden");
    document.querySelector('#backButton').classList.remove("hidden");
}

function livenessCheckInit() {

    if (stepNumber == 3) {
        let randNum = Math.floor(Math.random() * 5) + 1;
        document.querySelector('#livenessCheckMsg').innerHTML = "Please hold " + randNum + " fingers up to the side of your face. Ensure the fingers are not covering your face.";
    }

    const constraints = {
        video: {
            width: { min: 640, ideal: 1920 },
            height: { min: 400, ideal: 1080 },
            aspectRatio: { ideal: 1.7777777778 },
        },
        frameRate: { max: 30 },
        facingMode: { exact: "user" }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then((e) => {
            console.log(e);
        })
        .catch(error => {
            console.log('getUserMedia error: ', error);
        });



}
var imageCapture;
var mediaStream;

// Get a Blob from the currently selected camera source and
// display this with an img element.
function takePhoto() {
    // imageCapture.takePhoto().then(function(blob) {
    //   console.log('Took photo:', blob);
    //   img.classList.remove('hidden');
    //   img.src = URL.createObjectURL(blob);
    // }).catch(function(error) {
    //   console.log('takePhoto() error: ', error);
    // });
}


const preview = document.querySelector("#imageSrc");
function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    return reader;
}

function previewFile() {
    const file = document.querySelector("#pickFile").files[0];

    if (file) {
        const fileReader = getBase64(file);

        fileReader.onload = e => {
            preview.src = e.target.result;
            console.log(e.target.result);
            base64Text = e.target.result;
        }
        fileReader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
}



hideAll();



// {
//     "gender": _gender.name,
//     if (_bvn != null && _bvn.isNotEmpty) "bvn": _bvn,
//     "document_number": _documentNo,
//     "date_of_birth": DateFormat('yyyy-MM-dd').format(_dob),
//     "country": _country.name,
//     if (_state != null) "state": _state.name,
//     "street_line_one": _address,
//     "selfie": _liveImageBase64,
//     "photo_id": _docImageBase64,
//     'document_type': _docType.code ?? _docType.name,
//     "postal_code": _postalCode,
//     "politically_exposed_person": "True",
//     "accept_terms": "True",
//     "accept_data_usage_policy": "True",
//   };