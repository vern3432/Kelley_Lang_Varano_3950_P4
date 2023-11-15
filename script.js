const sql3 = require('better-sqlite3');
console.log("imported")

const   db = new sql3('memory2.db');
const  csv = require('csv-parser');
const   fs = require('fs');
console.log("imported")
// create table

//  db.exec( 'DROP TABLE menuItems;' );
db.exec( 'CREATE TABLE IF NOT EXISTS menuItems (ISBN TEXT, Book_Title TEXT,Book_Author TEXT,Year_Of_Publication TEXT,Publisher TEXT,Image_URL_S TEXT,Image_URL_M TEXT, Image_URL_L TEXT );' );
console.log("executed")
const insrow = db.prepare('insert into menuItems (ISBN,Book_Title,Book_Author,Year_Of_Publication,Publisher,Image_URL_S,Image_URL_M,Image_URL_L) VALUES (?, ?,?,?,?,?,?,?)' );
fs.createReadStream('books.csv')
  .pipe(csv({"separator":","}))
  .on('data', (row) => {
    console.log(row)
    insrow.run(row.ISBN,row.Book_Title,row.Book_Author,row.Year_Of_Publication,row.Publisher,row.Image_URL_S,row.Image_URL_M,row.Image_URL_L);
    console.log(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    db.close();
  });
      