const sql3 = require('better-sqlite3');
console.log("imported")

// fs.unlink('user.db', function(err) {
//     if(err && err.code == 'ENOENT') {
//         // file doens't exist
//         console.info("File doesn't exist, won't remove it.");
//     } else if (err) {
//         // other errors, e.g. maybe we don't have enough permission
//         console.error("Error occurred while trying to remove file");
//     } else {
//         console.info(`removed`);
//     }
// });

const   db = new sql3('memory.db');
console.log('db loaded')
db.exec('DROP TABLE IF EXISTS users');
//
console.log('table dropped')
db.exec( 'CREATE TABLE IF NOT EXISTS users (username TEXT,password TEXT,profile_url TEXT, bio TEXT,collection TEXT);');
const insrow = db.prepare('insert into users (username,password,profile_url,bio,collection) VALUES (?, ?,?,?,?)');
insrow.run('aidan','123','https://cdn3.iconfinder.com/data/icons/general-icons-set-1/100/13_profile-512.png','sup mane','2005018,887841740,080652121X,452264464');
console.log("executed")

"2005018","887841740","080652121X","452264464"