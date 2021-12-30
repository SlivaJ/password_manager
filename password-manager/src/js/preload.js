// preload.js
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const { contextBridge, ipcRenderer, clipboard } = require("electron");
const { rando } = require("@nastyox/rando.js");
const bcrypt = require("bcrypt");

// Functions with access to the node.js enviornment.
const contextFunctions = {
  // *********************************** 'password_generator.js'
  copyPassword: (newPassword) => {
    clipboard.writeText(newPassword);
  },
  generateRandomIntArray: (selectedCharacterPoolLength, passwordLength) => {
    var returnArray = generateRandomIntArray(selectedCharacterPoolLength, passwordLength);
    return returnArray;
  },

  // *********************************** 'stored_credentials.js' 

  addNewAccount: (newValues) => {
    ipcRenderer.send("newAccount", newValues)
  },
  deleteAccount: (ID) => {
    ipcRenderer.send("deleteAccount", ID);
  },
  editAccount: (editValues) => {
    ipcRenderer.send("editAccount", editValues);
  },
  setEncryption: (newPragma) => {
    ipcRenderer.send("pragma", newPragma); //sqlCipher uses a pragma var as the master key to encrypt/decrypt database
  }, 
  getAccounts: (query) => {
    return new Promise((resolve,reject)=>{
      ipcRenderer.invoke('getAccounts', query).then((response)=>{
        console.log("in preload: ",response);
        //localStorage.setItem('localAccounts',JSON.stringify(response));
        resolve(response);
      });
    });
  }


}

//expose above functions
contextBridge.exposeInMainWorld("bridge", contextFunctions);

/* ************************** 'password generator.js' functions ************************** */
function generateRandomIntArray(selectedCharacterPoolLength, passwordLength) {
  //returns an array of random ints
  var randomIntArray = [];
  for (var i = 0; i < passwordLength; i++) {
    randomIntArray.push(rando(0, selectedCharacterPoolLength - 1)); //-1 account for 0 to n
  }
  return randomIntArray;
}

/* ************************** 'stored_credentials.js' functions ************************** */
ipcRenderer.on("dbQueryAll-reply", (event, args) => {
  //args passes along the object correctly for use here.
  console.log("in preload");
  document.getElementById("testid").innerText = "dumb dumb";
});


