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
    console.log(country);
    getStatesFromCountry(country);
    if (country.value == 'Nigeria') {
        document.querySelector("#bvnField").classList.remove("hidden");
    } else if (country.value != 'Nigeria') {
        document.querySelector("#bvnField").classList.add("hidden");
    }
}

function getStatesFromCountry(country) {
   const selectedCountry =  countryList.filter((country) => countryList.contains(country.toLowerCase()));
   console.log(selectedCountry);
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
        var selectDocTypeList = document.querySelector("#docType");


        for (let index = 0; index < countryList.length; index++) {
            const element = countryList[index];
            var option = document.createElement("option");
            option.value = element.name;
            option.text = element.name;
            selectCountryList.appendChild(option);
        }

        // for (let index = 0; index < supportedDocsList.length; index++) {
        //     const element = array[index];
        //     var option = document.createElement("option");
        //     option.value = element.iso3;
        //     option.text = element.name;
        //     selectCountryList.appendChild(option);
        // }

    }

    console.log(countries);
    console.log(supportedDocs);
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