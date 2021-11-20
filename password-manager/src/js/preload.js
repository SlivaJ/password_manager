const { contextBridge, ipcRenderer } = require('electron');
const sqlite3 = require('sqlite3');

const API = {
    sendMsg : (msg) => ipcRenderer.send("message",msg),
}

contextBridge.exposeInMainWorld("bridge", API );



function testFunction(){
    console.log("task complete");
}
