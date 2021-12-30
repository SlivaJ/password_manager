// Modules to control application life and create native browser window
const { contextBridge, ipcMain, clipboard } = require("electron");

const { app, BrowserWindow } = require("electron");
const path = require("path");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const rando = require("@nastyox/rando.js");
const fs = require("fs");
const { format } = require("path");

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("./src/html/main.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
//********************************************************************************************************//
//********************************************************************************************************//
//*********************************** Non Default code is below ******************************************//
//********************************************************************************************************//
//********************************************************************************************************//
//********************************************************************************************************//



/* *********************************** Database Setup *********************************** */
//Database EXIST = ?
const dbPath = "src/app_data/testData.db";

fs.exists(dbPath, function (isExist) {
  if (isExist) {
    console.log("Database exists at: ", dbPath);
  } else {
    console.log("File does not exist at: ", dbPath);
    console.log("Making database at ", dbPath);
    createLocalDB();
  }
});


// Database EXIST = False
function createLocalDB() { // Create local database and add tables
  var db = new sqlite3.Database("src/app_data/testData.db", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Database Created!");
    }
  });
  // Add two tables to database for user and passwords.
  db.run(
    "CREATE TABLE user(Key Text)"
    );
  db.run(
    "CREATE TABLE savedData(Service Text, Email Text, Username Text, Password Text, Tag Text)"
  );
}


// Database EXIST = TRUE
var db = connectLocalDB();
function connectLocalDB() {
  // Connect to local database function
  var db = new sqlite3.Database("src/app_data/testData.db", (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log("Database Connection established!");
    }
  });
  return db;
}


/* *********************************** SQL Statements *********************************** */

ipcMain.handle("getAccounts", async (event, args) => {
  var accounts = [];
  var rows = await getAccounts(args);
  //console.log("got results: ",rows);
  accounts = formatResults(rows);
  console.log("formatted acocunts: ",accounts);
  return accounts;
  
})

ipcMain.on('newAccount', (event,args)=>{
  var statement = formatAddStatement(args);
  console.log("SQL Statement: ",statement);
  executeStatement(statement);
})

ipcMain.on('deleteAccount',(event,args)=>{
  var statement = formatDeleteStatement(args);
  console.log("SQL Statement: ",statement);
  executeStatement(statement);
})

ipcMain.on('editAccount', (event,args)=>{
  var statement = formatEditStatement(args);
  console.log("Running Statement: ",statement);
  executeStatement(statement)
  
})





// *************************************** format statements *************************************** //
function formatAddStatement(newValues){
  newValues.forEach((value,index)=>{
    newValues[index] = '"'+value+'"';
  })
  var inputValues = newValues[0]+","+newValues[1]+","+newValues[2]+","+newValues[3]+","+newValues[4];
  var statement = "INSERT INTO savedData (Service, Email, Username, Password, Tag) VALUES ("+inputValues+")";
  return statement;
}

function formatDeleteStatement(ID){
  var statement = 'DELETE FROM savedData WHERE Key = ' +ID;
  return statement;
}
function formatEditStatement(editValues){
  console.log("new values :", editValues);
  //encrypt values here()
  var updateVales = 'Service = "'+editValues[1]+'", Email = "'+editValues[2]+'", Username="'+editValues[3]+'", Password="'+editValues[4]+'", Tag="'+editValues[5]+'" '
  var targetID = editValues[0];
  var statement = 'UPDATE savedData SET '+ updateVales + 'WHERE Key = '+targetID;
  console.log("Statement: ",statement);
  return statement;
}


// *************************************** format results *************************************** //
//format is probably where I will call encryption for retrieving data.
function formatResults(rows){
  var accounts = [];
  rows.forEach((row, index) => {
    //log the data here for encrypted view
    console.log(row.Key, " ", row.Service, " ",row.Email, " ",row.Username, " ",row.Password, " ",row.Tag);
    console.log(index)
    //decrypt data function call here
    //console log decrypted data then let format function place it and return the accounts
    accounts[index] = {
      ID: row.Key,
      Service: row.Service,
      Email: row.Email,
      Username: row.Username,
      Password: row.Password,
      Tag: row.Tag,
    };
  });
  return accounts;
}

// *************************************** encryption functions *************************************** //
//next up after reformatting the crud functions

// *************************************** async tasks *************************************** //
function executeStatement(statement){
  db.run(statement,function(error) {
    if (error){
      console.log(error);
    } else {
      console.log('Change Applied.');
    }
  });
}

function getAccounts(args) {
  console.log("calling db");
  return new Promise((resolve,reject)=>{
    db.all(args, (err, rows) => {
      if (err) {
        throw err;
        console.log("something went wrong.");
      }
      console.log("Finished getting accounts");
      resolve(rows)
    });
  })
}



