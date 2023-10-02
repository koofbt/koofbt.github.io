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
    console.log(country.value);
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
            const element = array[index];

            var option = document.createElement("option");
            option.value = array[i].iso3;
            option.text = array[i].name;
            selectCountryList.appendChild(option);

        }

    }

    console.log(countries);
    console.log(supportedDocs);
}

hideAll();
