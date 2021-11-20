const { contextBridge, ipcRenderer } = require('electron');


const Examples = {

    sendMsg : (msg) => ipcRenderer.send("message", msg),

}

contextBridge.exposeInMainWorld("bridge", Examples );




