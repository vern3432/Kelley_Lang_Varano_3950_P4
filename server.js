const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 3001;

const dbPath = path.resolve(__dirname, 'memory.db');
const db = new sqlite3.Database(dbPath);
// const userDbPath = path.resolve(__dirname, 'user.db');
// const userDb = new sqlite3.Database(userDbPath);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

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
  console.log(' sign up request received called')
  // const { username, password } = req.body;
  // res.json(req.body);
  // jsson=res.json(req.body)
  // console.log(jsson)
  const username = req.body.user_name;
  const password = req.body.pass_word;
  const pfp = req.body.pfp;
  const bio = req.body.bio;

  console.log(username)
  // Check if username is unique
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    if (row) {
      // Username already exists
      res.status(400).json({ error: 'Username already exists. Please choose another.' });
    } else {
      // Username is unique, proceed with signup
      db.run('INSERT INTO users (username, password,profile_url,bio) VALUES (?, ?,?,?)', [username, password,pfp,bio], (err) => {
        if (err) {
          res.status(500).send(err.message);
          console.log("insert failed")
          return;
        }

        res.status(200).json({ message: 'Signup successful. Please Login' });
      });
    }
  });
  console.log("sign up successful")
});

//login
app.post('/login', (req, res) => {
  console.log('log in request received called')
  // const { username, password } = req.body;
  // res.json(req.body);
  // jsson=res.json(req.body)
  // console.log(jsson)
  const username = req.body.user_name;
  const password = req.body.pass_word;

  console.log(username)
  // Check if username is unique
  db.get('SELECT * FROM users WHERE (username, password) IN ( VALUES (?, ?))', [username,password], (err, row) => {
    if (err) {
      res.status(400).send("errror 400");
      console.log('error was sent')
      return;
    }
    if (row) {
      // Username already exists
      console.log('row condition met')
      // res.status(200).json({ message: 'Login successful. Loading Page' });
     
      console.log('login in scccesful')
    }else{ console.log("login failed");
}
  });
  console.log("Login proccessed")
});


app.post('/tab_page_request', (req, res) => {
  console.log('getting data for table:tab_page_request')
  const num_start = parseInt(req.body.start);
  const finish = req.body.finish;
 console.log(num_start)
 console.log(finish)

  const query = 'SELECT * FROM menuItems limit '+ num_start.toString()+','+finish.toString(); 
  console.log(query)
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    console.log("sending")
    res.json(rows);
  });


  
});

app.post('/addCollection', (req, res) => {
  console.log('collection add began t')
  const user_name = req.body.user_name;
  const ISBN = req.body.ISBN;
 console.log(user_name)
 console.log(ISBN)
 db.get('SELECT * FROM users WHERE (username) IN ( VALUES (?))', [user_name], (err, row) => {
  if (err) {
    res.status(400).send("errror 400");
    console.log('error was sent')
    return;
  }
  if (row) {
    // Username already exists
    console.log('row codition met:'+row.toString())
    // updaterow=row+","+ISBN;
    // db.run('UPDATE users SET collection ="'+updaterow+'" WHERE username='+'"'+user_name+'"')
    forrun='UPDATE users SET collection = collection || '+'"'+','+ISBN+'"'+' WHERE username='+'"'+user_name+'"';
    console.log(forrun)
    db.run(forrun)

    console.log("update ran")
  }else{ console.log("login failed");
}
});
});

app.post('/removeCollection', (req, res) => {
  console.log('collection add began t')
  const user_name = req.body.user_name;
  const ISBN = req.body.ISBN;
 console.log(user_name)
 console.log(ISBN)
 db.get('SELECT collection FROM users WHERE (username) IN ( VALUES (?))', [user_name], (err, row) => {
  if (err) {
    res.status(400).send("errror 400");
    console.log('error was sent')
    return;
  }
  if (row) {
    // Username already exists
    console.log('row codition met:'+row)
    quiry="SELECT * FROM users WHERE username = '"+ user_name +"';"
    console.log(quiry)
    string_returned=db.run(quiry)
    console.log(JSON() collection)

  }else{ console.log("login failed");
}
});
});

app.post('/search', (req, res) => {
  console.log('getting data for table:search')
  const search_term = req.body.search_term;
  const type = req.body.type;

  // const type='Book_Title'
 console.log(search_term)
///expression [ NOT ] SIMILAR TO pattern [ ESCAPE 'escape_char' ]
//  const query = 'SELECT * FROM menuItems where '+type+' SIMILAR TO pattern '+ search_term;
//  const query = 'SELECT * FROM menuItems WHERE '+type+' LIKE '+ '%'+search_term+ '%';

  const query = 'SELECT * FROM menuItems WHERE '+type+' LIKE "%'+search_term+'%"'+'COLLATE SQL_Latin1_General_CP1_CI_AS';
  console.log(query)
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    console.log("sending")
    res.json(rows);
  });


  
});










app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});









// ... (the rest of your existing code)




// app.post('/signup', (req, res) => {
//   console.log('getting data for table')
  
//   const query = 'SELECT * FROM users'; 
//   db.all(query, [], (err, rows) => {
//     if (err) {
//       res.status(500).send(err.message);
//       return;
//     }
//     res.json(rows);
//   });
// });

