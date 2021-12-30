//password_generator.js manages the password_generator.html page functionality.
//Written by John Sliva 
//2021

//Event listeners for UI
const characterAmountNumber = document.getElementById('characterAmountNumber');
const characterAmountRange = document.getElementById('characterAmountRange');
characterAmountNumber.addEventListener('input', syncCharacterAmount);
characterAmountRange.addEventListener('input', syncCharacterAmount);

// 'generate new password' button
function generateNewPassword(){
    // Set default values for UI and character pool array.
    var passwordLength = 0;
    var includeLowercase = true;
    var includeUppercase = true;
    var includeNumbers = false;
    var includeSpecialCharacters = false;
    var randomIntArray = [];
    var newPassword = '';
    
    // Update values based on user input
    passwordLength = document.getElementById("characterAmountNumber").value;
    includeUppercase = document.getElementById("include_uppercase_checkbox").checked;
    includeNumbers = document.getElementById("include_numbers_checkbox").checked;
    includeSpecialCharacters = document.getElementById("include_special_characters_checkbox").checked;

    // Generate pool of characters to be selected from.
    //ASCII TABLE: https://www.asciitable.com/
    const lowercase_codes = characterArrayBuilder(97,122)
    const uppercase_codes = characterArrayBuilder(65,90)
    const number_codes = characterArrayBuilder(48,57)
    const symbol_codes = characterArrayBuilder(33,47)
                         .concat(characterArrayBuilder(58,63))
                         .concat(characterArrayBuilder(91,95))
                         .concat(characterArrayBuilder(123,126))
    
    var selectedCharacterPool = lowercase_codes;
    if(includeUppercase==true){
        selectedCharacterPool = selectedCharacterPool.concat(uppercase_codes)
    }
    if(includeNumbers==true){
        // Numbers are added to the array twice to decrease instances of
        // generated passwords with no numbers while number is selected on
        // the lower end of the range scale. 
        selectedCharacterPool = selectedCharacterPool.concat(number_codes)
        selectedCharacterPool = selectedCharacterPool.concat(number_codes)
    }
    if(includeSpecialCharacters==true){
        selectedCharacterPool = selectedCharacterPool.concat(symbol_codes)
    }

    //time to create a bridge that goes from here to the main and returns an array of numbers that 
    //will then be converted into their asccii values and displayed on the output box
    //first value: array len ----- second value: password len
    randomIntArray = window.bridge.generateRandomIntArray(selectedCharacterPool.length,passwordLength);
    
    console.log("charpool: ",selectedCharacterPool);
    console.log("returned array: ",randomIntArray);
    randomIntArray.forEach(element => {
        newPassword = newPassword.concat(String.fromCharCode(selectedCharacterPool[element]));
    });
    console.log(newPassword);

    document.getElementById("generatedPasswordDisplay").value = newPassword;
}
//finished functions
function syncCharacterAmount(e){
    const value = e.target.value;
    characterAmountNumber.value = value;
    characterAmountRange.value = value;
}
function characterArrayBuilder(startValue, endValue){ //Creates array of characters for rando to select from
    var resultArray = new Array();
    for(startValue; startValue <= endValue; startValue++){
        //console.log(startValue);
        resultArray.push(startValue);
    }
    return resultArray; 
}
function copyPassword(){ // Button that copies generated password in output box to clipboard
    var copiedText = document.getElementById("generatedPasswordDisplay").value;
    window.bridge.copyPassword(copiedText);
}
