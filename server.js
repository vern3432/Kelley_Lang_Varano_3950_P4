const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 3001;

const dbPath = path.resolve(__dirname, 'memory.db');
const db = new sqlite3.Database(dbPath);
const userDbPath = path.resolve(__dirname, 'user.db');
const userDb = new sqlite3.Database(userDbPath);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/data', (req, res) => {
  console.log('getting data for table')
  const query = 'SELECT * FROM menuItems'; 
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});

app.post('/signup', (req, res) => {
  console.log('getting data for table')
  const query = 'SELECT * FROM menuItems'; 
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
