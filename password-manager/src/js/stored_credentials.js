//Handle table display update.
//Query generation based on user input in filter field
//Add new accounts to database based on user input field

//I wonder if a global variable would be ok to use here to decrease the amount
//of times that I call the database. Could be useful considering I call the 
//database every time I do anything and the encryption will eventually be in that function.
//maybe change it to call every time I add a value to the database so that its added immediatly.
//
//local storage will hold the accounts just need to read from them now. need to stringify then parse the object to use it

// ************************************************ test Function ************************************************ //
  function test(){//calls db to get data for now
    console.log("Test function");
    DB_GetData();
  }
// ************************************************ Display Interaction ************************************************ //
//fast update of search as the user types
var filterInputService = document.getElementById('filterService')
var filterInputEmail = document.getElementById('filterEmail')
var filterInputUsername = document.getElementById('filterUsername')
var filterInputPassword = document.getElementById('filterPassword')
var filterInputTag = document.getElementById('filterTag')

filterInputService.addEventListener('input',applyFilter);
filterInputEmail.addEventListener('input',applyFilter);
filterInputUsername.addEventListener('input',applyFilter);
filterInputPassword.addEventListener('input',applyFilter);
filterInputTag.addEventListener('input',applyFilter);

// ************************************************ button controls ************************************************ //

function clearFilter(){
  console.log(JSON.parse(JSON.stringify(localStorage.getItem('localAccounts'))));
  //arrayAccounts = JSON.parse(localStorage.getItem('localAccounts'));

  var clearInputField = '';
  filterID.value = clearInputField;
  filterInputService.value = clearInputField;
  filterInputEmail.value = clearInputField;
  filterInputUsername.value = clearInputField;
  filterInputPassword.value = clearInputField;
  filterInputTag.value = clearInputField;
  applyFilter();
}

function formatNewAccount(){
  var newServiceValue = document.getElementById('filterService').value;
  var newEmailValue = document.getElementById('filterEmail').value;
  var newUsernameValue = document.getElementById('filterUsername').value;
  var newPasswordValue = document.getElementById('filterPassword').value;
  var newTagValue = document.getElementById('filterTag').value;
  //var addRowSQL = 'INSERT INTO savedData (Service, Email, Username, Password, Tag) Values ('+newServiceValue+', '+newEmailValue+', '+newUsernameValue+', '+newPasswordValue+', '+newTagValue+')';
  var newAccountValues = [newServiceValue, newEmailValue, newUsernameValue, newPasswordValue, newTagValue];
  addPassword(newAccountValues);
}
function addAccount(){//get values like before then pass the values instead of the whole sql statement

}

function deleteAccountID(){
  var accountID = document.getElementById("filterID").value;
  console.log("Delete account",accountID);
  window.bridge.deleteAccount(accountID);
  DB_GetData();
}

function editAccountID(){
  var editID = parseInt(document.getElementById('filterID').value);
  //console.log(typeof(editID));
  var localAccounts = JSON.parse(localStorage.getItem('localAccounts'));
  var editAccount = localAccounts.filter(localAccount=>{
    return localAccount.ID === editID;
  });
  console.log("-------------",editAccount);
  var editValues = [];
  editValues[0] = editAccount[0].ID;
  editValues[1] = editAccount[0].Service;
  editValues[2] = editAccount[0].Email;
  editValues[3] = editAccount[0].Username;
  editValues[4] = editAccount[0].Password;
  editValues[5] = editAccount[0].Tag;
  //console.log("****************",editValues)

  if(document.getElementById('filterService').value != ''){
    editValues[1] = document.getElementById('filterService').value;
  }
  if(document.getElementById('filterEmail').value != ''){
    editValues[2] = document.getElementById('filterEmail').value;
  }
  if(document.getElementById('filterUsername').value != ''){
    editValues[3] = document.getElementById('filterUsername').value;
  }
  if(document.getElementById('filterPassword').value != ''){
    editValues[4] = document.getElementById('filterPassword').value;
  }
  if(document.getElementById('filterTag').value != ''){
    editValues[5] = document.getElementById('filterTag').value;
  }
  
  //console.log("****************",editValues)
  window.bridge.editAccount(editValues);
  DB_GetData();
}

// ************************************************ Table Update ************************************************ //
defaultTable();
//set up default table 
function defaultTable(){
  var row = displayTable.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    cell1.innerHTML = "Service: ";
    cell2.innerHTML = "Email: ";
    cell3.innerHTML = "Username: ";
    cell4.innerHTML = "Password: ";
    cell5.innerHTML = "Tag: ";
    applyFilter();
}
//update table
function updateTable(accounts){
  var displayTable = document.getElementById('displayTable');
  while(displayTable.firstChild){//clear table out before update
    displayTable.removeChild(displayTable.firstChild);
  }
    var row = displayTable.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    cell1.innerHTML = "ID: ";
    cell2.innerHTML = "Service: ";
    cell3.innerHTML = "Email: ";
    cell4.innerHTML = "Username: ";
    cell5.innerHTML = "Password: ";
    cell6.innerHTML = "Tag: ";
    
  console.log("updating table with accounts list");
  accounts.forEach((account,index) => {
    row = displayTable.insertRow(index + 1)
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    var cell5 = row.insertCell(4);
    var cell6 = row.insertCell(5);
    cell1.innerHTML = account.ID;
    cell2.innerHTML = account.Service;
    cell3.innerHTML = account.Email;
    cell4.innerHTML = account.Username;
    cell5.innerHTML = account.Password;
    cell6.innerHTML = account.Tag;
  });
}
// ************************************************ Database interaction ************************************************ //
 async function dataWait(query){
  accounts = await window.bridge.getAccounts(query);
  return accounts;
}
async function DB_GetData(){
  var query = 'SELECT * FROM savedData';
  //console.log("sending query: ",query);
  accounts = await dataWait(query)
  console.log("in DB_GetData: ",accounts);
  
  localStorage.setItem('localAccounts',JSON.stringify(accounts));

  applyFilter();
}
function addPassword(accountQuery){
  window.bridge.addNewAccount(accountQuery);
  DB_GetData();
}
function deleteAccount(){

}

// ************************************************ Filter Results ************************************************ //
//Current version gets all data accounts
//then applies filter and calls update table.
function applyFilter(){
//get all values from filter inputs
  accounts = JSON.parse(localStorage.getItem('localAccounts'));
  var filterService = document.getElementById('filterService').value; 
  var filterEmail = document.getElementById('filterEmail').value;
  var filterUsername = document.getElementById('filterUsername').value; 
  var filterPassword = document.getElementById('filterPassword').value;
  var filterTag = document.getElementById('filterTag').value;
  var filteredResults = [];
  
  accounts.forEach((account,index) =>{
    //if any values hit the condition flag filter doesnt match and
    //the account at that index will not be added to the display filter.
    //comparison made in lowercase, display is as saved in DB.
    var conditionCheck = 0;
    if(!(account.Service.toLowerCase().includes(filterService.toLowerCase()))){conditionCheck++}
    if(!(account.Email.toLowerCase().includes(filterEmail.toLowerCase()))){conditionCheck++}
    if(!(account.Username.toLowerCase().includes(filterUsername.toLowerCase()))){conditionCheck++}
    if(!(account.Password.toLowerCase().includes(filterPassword.toLowerCase()))){conditionCheck++}
    if(!(account.Tag.toLowerCase().includes(filterTag.toLowerCase()))){conditionCheck++}
    
    if(conditionCheck==0){
      filteredResults.push(accounts[index]);
    }
    
  })

  updateTable(filteredResults);

}


