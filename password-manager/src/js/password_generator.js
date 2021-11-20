//password_generator.js manages the password_generator.html page functionality.
//Written by John Sliva 
//2021
                                            // Might remove underscore library. I am not sure if its worth using the library to save 3 forloops of code...
//const { forEach } = require('underscore'); // not sure why I need this because I already have underscore lib. It's also only used in test functions so worst case is delete both.
// Is forEach native???
const _ = require('underscore'); // IPC swap
const {rando, randoSequence} = require('@nastyox/rando.js'); // IPC swap
//const { clipboard } = require('electron') //I think this is ok to leave locally but I'll double check
//I think the IPC thing I need here is the ipcRenderer one. 


//Sync range bar to number text box.
const characterAmountNumber = document.getElementById('characterAmountNumber');
const characterAmountRange = document.getElementById('characterAmountRange');
characterAmountNumber.addEventListener('input', syncCharacterAmount);
characterAmountRange.addEventListener('input', syncCharacterAmount);

function syncCharacterAmount(e){
    const value = e.target.value;
    characterAmountNumber.value = value;
    characterAmountRange.value = value;
}

//password generation for "generate new password" button
//All selection ranges upper values are increased by 1 to
//account for range function upper value being non-inclusive.
//True ASCII range listed after each function use.
function generateNewPassword(){
    var passwordLength = 0;
    var includeLowercase = true;
    var includeUppercase = true;
    var includeNumbers = false;
    var includeSpecialCharacters = false;
    var newPassword = '';
    var selected_code_groups = []
    
    //ASCII character arrays generated with range function
    //ASCII TABLE: https://www.asciitable.com/
    const lowercase_codes = _.range(97,123); //(97,122)
    const uppercase_codes = _.range(65,91); //(65,90)
    const number_codes = _.range(48,58); //(48,57)
    const symbol_codes = _.range(33,48) //(33,47)
    .concat(_.range(58,64)) //(58,63)
    .concat(_.range(91,96)) //(91,95)
    .concat(_.range(123,127)); //(123,126)

    //get selected conditions
    passwordLength = document.getElementById("characterAmountNumber").value;
    includeUppercase = document.getElementById("include_uppercase_checkbox").checked;
    includeNumbers = document.getElementById("include_numbers_checkbox").checked;
    includeSpecialCharacters = document.getElementById("include_special_characters_checkbox").checked;

    //concat range groups based on checkbox values
    selected_code_groups = selected_code_groups.concat(lowercase_codes); 
    if(includeUppercase==true){selected_code_groups = selected_code_groups.concat(uppercase_codes);}
    if(includeSpecialCharacters==true){selected_code_groups = selected_code_groups.concat(symbol_codes);}
    if(includeNumbers==true){//special case solution 1: numbers set added in twice
        selected_code_groups = selected_code_groups.concat(number_codes);
        selected_code_groups = selected_code_groups.concat(number_codes);
    }
    //select from 1 to n where n is the length of the array
    //take value at n and convert to char
    //concat char to newPassword string
    for(var i = 0; i < passwordLength; i++){
        var selectedCode = rando(selected_code_groups.length-1);//-1 to account for range of 0-25 rather than 1-26
        /* console.log(selectedCode);//working */
        var nextChar = String.fromCharCode(selected_code_groups[selectedCode]);
        /* console.log(nextChar); */
        newPassword = newPassword.concat(nextChar);
        
    }
    
    /* console.log(newPassword);
    console.log("the new passwords length is: "+passwordLength);
    console.log("include lowercase: "+includeLowercase);
    console.log("inclue uppercase: "+includeUppercase);
    console.log("include numbers: "+includeNumbers);
    console.log("include special characters: "+includeSpecialCharacters);
    console.log(selected_code_groups);
     */
    document.getElementById('generatedPasswordDisplay').value = newPassword;
}
function copyPassword(){//quick copy generated password to clipboard
    var copiedText = document.getElementById("generatedPasswordDisplay").value;
    //clipboard.writeText(copiedText);
    window.bridge.copyPassword(copiedText);
}

/* ----------------------------------- Test Functions -----------------------------------  */

//Testing function may be needed later if I use something
//other than the range function to generate the ASCII arrays. 
//All selection ranges upper values are increased by 1 to
//account for range function upper value being non-inclusive.
//True ASCII range listed after each function use.
function testAsciiSelection(){
    //ASCII character arrays 97,122
    const lowercase_codes = _.range(97,123); //(97,122)
    const uppercase_codes = _.range(65, 91); //(65, 90)
    const number_codes = _.range(48, 58); //(48, 57)
    const symbol_codes = _.range(33,48) //(33,47)
    .concat(_.range(58,64)) //(58,63)
    .concat(_.range(91,96)) //(91,95)
    .concat(_.range(123,127)); //(123,126)

    
    //Display Sections
    console.log("lowercase selection");
    console.log(lowercase_codes.forEach(element => console.log(String.fromCharCode(element))))
    console.log("uppercase selection");
    console.log(uppercase_codes.forEach(element => console.log(String.fromCharCode(element))))
    console.log("number selection");
    console.log(number_codes.forEach(element => console.log(String.fromCharCode(element))))
    console.log("symbol selection");
    console.log(symbol_codes.forEach(element => console.log(String.fromCharCode(element))))

    //clipboard functionality test
    clipboard.writeText('Example String', 'selection')
    console.log(clipboard.readText('selection'))

    //Progress notes
    //Standing problem: 
    //selection being random means that there is a chance
    //that even with a checkbox selected (numbers symbols capitals) it may not
    //have the selected type in the generated password.
    //current solution:
    //include numbers array twice making the chance that at the minimum length
    //of 8 characters including all checkboxs creates a less than 20% chance of no 
    //number showing up in the generated password (previously 39% chance approx 1 in 3).  


}