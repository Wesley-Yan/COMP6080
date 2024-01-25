// obtain DOMs
const result = document.getElementById('form-result');
const streetName = document.getElementById('street-name');
const suburb = document.getElementById('suburb');
const postcode = document.getElementById('postcode');
const dob = document.getElementById('dob');
const buildingType = document.getElementById('building-type');
const features = document.getElementsByName('features');

// functions to check if street, suburb, postcode and dob is valid
const validStreet = () => {
    return !(streetName.value.length < 3 || streetName.value.length > 50);
}
const validSuburb = () => {
    return !(suburb.value.length < 3 || suburb.value.length > 50);
}
const validPostcode = () => {
    return !(isNaN(postcode.value) || postcode.value === '' || postcode.value.length != 4);
}
const validdob = () => {
    const date = dob.value;
    if (date.length != 10 || date[2] != '/' || date[5] != '/') {
        return false;
    }
    const dateString = date.slice(3, 5) + '/' + date.slice(0, 2) + '/' + date.slice(6);
    return !(isNaN(Date.parse(dateString)));
}

// check if all inputs are valid, and output corresponding texts
const validInput = () => {
    // error checking
    if (!validStreet()) {
        result.value = 'Please input a valid street name';
    }
    if (validStreet() && !validSuburb()) {
        result.value = 'Please input a valid suburb';
    }
    if (validStreet() && validSuburb() && !validPostcode()) {
        result.value = 'Please input a valid postcode';
    }
    if (validStreet() && validSuburb() && validPostcode() && !validdob()) {
        result.value = 'Please enter a valid date of birth';
    }
    // all inputs valid, output result
    if (validStreet() && validSuburb() && validPostcode() && validdob()) {
        // calculate the age
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        let birthDay = '';
        if (dob.value[0] != 0) {
            birthDay = dob.value.slice(0, 2);
        }
        else {
            birthDay = dob.value.slice(1, 2);
        }
        let birthMonth = '';
        if (dob.value[3] != 0) {
            birthMonth = dob.value.slice(3, 5);
        }
        else {
            birthMonth = dob.value.slice(3, 4);
        }
        const birthYear = dob.value.slice(6);
        let age = 0;
        if (birthMonth > month) {
            age = year - birthYear - 1;
        }
        else if (birthMonth == month && birthDay > day) {
            age = year - birthYear - 1;
        }
        else {
            age = year - birthYear;
        }

        // obtain features output
        const featureList = [];
        for (let i = 0; i < features.length; i++) {
            if (features[i].checked) {
                featureList.push(features[i].value);
            }
        }
        let featureOut = '';
        if (featureList.length === 0) {
            featureOut = "no features";
        }
        else {
            featureOut = featureList[0];
            if (featureList.length > 1) {
                for (let i = 1; i < featureList.length; i++) {
                    featureOut += ', ';
                    if (i === featureList.length - 1) {
                        featureOut += 'and ';
                    }
                    featureOut += featureList[i];
                }
            }
        }

        // select a/an
        let house = 'a';
        if (buildingType.value === 'apartment') {
            house = 'an'
        }
        // change to uppercase
        let buildingTypeUpper = buildingType.value;
        buildingTypeUpper = buildingTypeUpper.charAt(0).toUpperCase() + buildingTypeUpper.slice(1);
        
        result.value = `You are ${age} years old, and your address is ${streetName.value} St, ${suburb.value}, ${postcode.value}, Australia. Your building is ${house} ${buildingTypeUpper}, and it has ${featureOut}`
    }
}

// each time the input block changed should call the input check function
streetName.onblur = () => {
    validInput();
}
suburb.onblur = () => {
    validInput();
}
postcode.onblur = () => {
    validInput();
}
dob.onblur = () => {
    validInput();
}
buildingType.onchange = () => {
    validInput();
}

// check the select all button text, and each time it's changed, result new output
const selectAll = document.getElementById('select-all-btn');
selectAll.addEventListener('click', () => {
    if (selectAll.value === 'Select All') {
        features.forEach(feature => feature.checked = true);
        selectAll.value = 'Deselect all';
        validInput();
    }
    else {
        features.forEach(feature => feature.checked = false);
        selectAll.value = 'Select All';
        validInput();
    }
})

// each time the select box chenged should check the valid input and selectAll button
for (let i = 0; i < features.length; i++) {
    features[i].onchange = () => {
        validInput();
        checkAll();
        
    }
}

// update selectAll button text
const checkAll = () => {
    let cnt = 0;
    for (let i = 0; i < features.length; i++) {
        if (features[i].checked) {
            cnt++;
        }
    }
    if (cnt == features.length) {
        selectAll.value = 'Deselect all';
    }
    else {
        selectAll.value = 'Select All';
    }
}

// reset to original form each time reset button is clicked
const reset = document.getElementById('reset-form');
reset.addEventListener('click', () => {
    streetName.value = '';
    suburb.value = '';
    postcode.value = '';
    dob.value = '';
    buildingType.value = 'apartment';
    features.forEach(feature => feature.checked = false);
    selectAll.value = 'Select All';
    result.value = '';
})