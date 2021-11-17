//build connection to sqlite database
//test CRUD functionality
//encrypt data with crypto or built in thing SEE I think?

//var db = new sqlite3.Database('src/app_data/test.sqlite3');   //this works starting from the 'password-manager' folder not from the js file it's called in.

//following check function fixes the problem that caused the app to crash if the stored credential page was opened more than once.
var isDatabaseSetup;
function database_setup(){
  if(isDatabaseSetup==false){
    var sqlite3 = require('sqlite3').verbose();
    db_setup = true;
    console.log("setup");
  }else if(isDatabaseSetup==true){
    console.log("skipped dependency and connect")
  }
}

connectDB();
/* 
function openDB(){
  let db = new sqlite3.Database('src/app_data/database.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('This was entirely too much effort');
  });
}
  
function querytesting(){
  let sql = 'SELECT * FROM Info'

  db.each(sql, function(err, row) {
    console.log("User id: "+row.Username+" Password: "+ row.Password+" Tag: "+ row.Tag);
  });
}
function closeConnection(){
  db.close();
}
 */
/* 
//following code creates a database and adds values to it.
//delete this code later because it was an example 
db.serialize(function() {
  db.run("CREATE TABLE user (id INT, dt TEXT)");

  var stmt = db.prepare("INSERT INTO user VALUES (?,?)");
  for (var i = 0; i < 10; i++) {
  
  var d = new Date();
  var n = d.toLocaleTimeString();
  stmt.run(i, n);
  }
  stmt.finalize();

  db.each("SELECT id, dt FROM user", function(err, row) {
      console.log("User id : "+row.id, row.dt);
  });
});

db.close();
 */