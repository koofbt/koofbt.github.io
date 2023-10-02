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
    localStorage.setItem('bearerToken', window.location.href.split('/?q=')[1]);

    document.addEventListener("DOMContentLoaded", () => {
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


let stateList = [];

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

function getDocsFromCountry(country){

    let countryDocsObject = supportedDocsList.filter((el) => {
        return el.country == country.toLowerCase() || el.country == 'default';
    })[0];

    var selectDocTypeList = document.querySelector("#docType");
    if (selectStateList.length != 0) {
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

let countryList = [];
let supportedDocsList = [];

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