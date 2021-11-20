const { contextBridge, ipcRenderer } = require('electron');

// Functions with access to the node.js enviornment.
const contextFunctions = {
    
    
    sendMsg : (msg) => ipcRenderer.send("message", msg),

    copyPassword : (newPassword) => ipcRenderer.send("clipboard", newPassword),

}

contextBridge.exposeInMainWorld("bridge", contextFunctions );



