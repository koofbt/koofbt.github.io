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
    localStorage.setItem('bearerToken', window.location.href.split('/?q=')[1]);

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
        fetchData();
    }
    );

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

    console.log(stateList);
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

        // for (let index = 0; index < selectDocTypeList.length; index++) {
        //     const element = array[index];
        //     var option = document.createElement("option");
        //     option.value = element.iso3;
        //     option.text = element.name;
        //     selectCountryList.appendChild(option);
        // }
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
}

function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      return reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
      return;
    };
 }

function previewFile() {
    const preview = document.querySelector("#imageSrc");
    const file = document.querySelector("#pickFile").files[0];
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        () => {
            // convert image file to base64 string
            preview.src = reader.result;
        },
        false,
    );

    if (file) {
        let x = getBase64(file);
        console.log(x);
    }
}

// const reader = new FileReader();
// const fileInput = document.getElementById("pickFile");
// const img = document.getElementById("imageSrc");

// reader.onload = e => {
//     img.src = e.target.result;
// }
// fileInput.addEventListener('change', e => {
//     const f = e.target.files[0];
//     const fileBase64 = reader.readAsDataURL(f);
// })

// function pickDocumentImage() {
//     document.querySelector("#imageSrc").src = "";
// }

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