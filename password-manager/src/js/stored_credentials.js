//Problem: Find some way to create a database of secure credentials(service,Username,Password)
//solutions:
//(Keytar): Failed: Uses built in os credential manager.
//                  Easy enough to use but the windows credential manager sucks.
//                  Cant hold multiple usernames and passwords from the same service
//                  and multiple accounts like that are like 90% of the reason Im doing this...
//(SQLite) : Research : Can be packaged in the app without need for added dependencies.
// knex                 Something called SEE exists allowing sqlite to write and read encrypted data.
//                      Not sure how to set this up so hopefully its not that hard 
//(LokiJS & crypted file adapter): Research: currently installed in node dont forget to delete if I use sqlite
//
//
//mongodb and mongoose to the rescue... probably
//
//
//Current solution:(learning how to use json at the moment): using crypto.js and encrypting a json file that will contain all of the data
//IV (initiation vector) added to the front of the encryption 
//current version will have only one json file but might make the ability to add new sets later
//
//might also make a branch version of the app that uses a database but at this scale im not sure if its worth it. and I would have to have
//one that could be encrypted as a whole and packaged with the application.


const sqlite3 = require('sqlite3');

var knex = require("knex")({
    client: "sqlite3",
    connection:{
        filename: "../app_data/database.db"
    },
    useNullAsDefault: true
});


knex.from('Info').select("*")
    .then((rows) => {
        for (row of rows) {
            console.log(`${row['Username']} ${row['Password']} ${row['Tag']}`);
        }
    }).catch((err) => { console.log( err); throw err })
    .finally(() => {
        knex.destroy();
    });





//failed solution 1:
/* const keytar = require('keytar');


function keytarTest(){   
   // keytar.setPassword('fakenetwork', 'AccountName', 'secret');
    const secret = keytar.findPassword(search('gmail'));
    secret.then((result) => {
        if(result != null){
            console.log("result: "+ result); // result will be 'secret'
        }
        else if(result == null){
            console.log("fail");
        }
    });
    /* keytar.getPassword('fakenetwork','john').then((result) => {
        console.log("password: "+result) 

}
 */