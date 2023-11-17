const sql3 = require('better-sqlite3');
console.log("imported")

new sql3('memory2.db');
console.log('db loaded')
db.exec('DROP TABLE IF EXISTS users');
//
console.log('table dropped')
db.exec( 'CREATE TABLE IF NOT EXISTS users (username TEXT,password TEXT,profile_url TEXT);');
const insrow = db.prepare('insert into users (username,password,profile_url) VALUES (?, ?,?)');
insrow.run('aidan','123','https://cdn3.iconfinder.com/data/icons/general-icons-set-1/100/13_profile-512.png');
console.log("executed")
