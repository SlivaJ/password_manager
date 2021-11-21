const { contextBridge, ipcRenderer, clipboard } = require('electron');
const {rando} = require('@nastyox/rando.js');

// Functions with access to the node.js enviornment.
const contextFunctions = {
    
    //Test IPC
    sendMsg : (msg) => ipcRenderer.send("message", msg),

    // 'password_generator.js'  
    copyPassword : (newPassword) => {clipboard.writeText(newPassword)},

    generateRandomIntArray : (selectedCharacterPoolLength, passwordLength) => generateRandomIntArray(selectedCharacterPoolLength, passwordLength),

    // 'stored_credentials.js'

}

contextBridge.exposeInMainWorld("bridge", contextFunctions );

// 'password generator.js' functions 
function generateRandomIntArray(selectedCharacterPoolLength, passwordLength){ //returns an array of random ints
    var randomIntArray = [];
    for(var i = 0; i<passwordLength; i++){
        randomIntArray.push(rando(0,selectedCharacterPoolLength-1));//-1 account for 0 to n 
    }
    return randomIntArray;
}

// 'stored_credentials.js' functions

