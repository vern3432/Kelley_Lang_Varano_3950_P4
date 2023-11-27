const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const port = 3001;
// var async=require('async')

const dbPath = path.resolve(__dirname, "memory.db");
const db = new sqlite3.Database(dbPath);
// const userDbPath = path.resolve(__dirname, 'user.db');
// const userDb = new sqlite3.Database(userDbPath);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

app.get("/data", (req, res) => {
  console.log("getting data for table");
  const query = "SELECT * FROM menuItems";
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});



app.post("/submitpost", (req, res) => {
  console.log(" sign up request received called");
  // const { username, password } = req.body;
  // res.json(req.body);
  // jsson=res.json(req.body)
  // console.log(jsson)
  const username = req.body.user_name;
  const password = req.body.pass_word;
  const pfp = req.body.pfp;
  const bio = req.body.bio;

  console.log(username);
  // Check if username is unique
  db.get("SELECT * FROM menuItems WHERE ISBN = ?", [username], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    if (row) {
      // Username already exists
      res
        .status(400)
        .json({ error: "ISBN already exists. Please choose another." });
    } else {
      // Username is unique, proceed with signup
      db.run(
        "INSERT INTO users (username, password,profile_url,bio,collection) VALUES (?, ?,?,?,?)",
        [username, password, pfp, bio,''],
        (err) => {
          if (err) {
            res.status(500).send(err.message);
            console.log("insert failed");
            return;
          }

          res.status(200).json({ message: "Signup successful. Please Login" });
        }
      );
    }
  });
  console.log("sign up successful");
});








app.post("/signup", (req, res) => {
  console.log(" sign up request received called");
  // const { username, password } = req.body;
  // res.json(req.body);
  // jsson=res.json(req.body)
  // console.log(jsson)
  const username = req.body.user_name;
  const password = req.body.pass_word;
  const pfp = req.body.pfp;
  const bio = req.body.bio;

  console.log(username);
  // Check if username is unique
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    if (row) {
      // Username already exists
      res
        .status(400)
        .json({ error: "Username already exists. Please choose another." });
    } else {
      // Username is unique, proceed with signup
      db.run(
        "INSERT INTO users (username, password,profile_url,bio,collection) VALUES (?, ?,?,?,?)",
        [username, password, pfp, bio,''],
        (err) => {
          if (err) {
            res.status(500).send(err.message);
            console.log("insert failed");
            return;
          }

          res.status(200).json({ message: "Signup successful. Please Login" });
        }
      );
    }
  });
  console.log("sign up successful");
});

//login

//  db.get('SELECT * FROM users WHERE (username, password) IN ( VALUES (?, ?))', [username,password], (err, row) => {

app.post("/login", (req, res) => {
  console.log(" sign up request received called");
  // const { username, password } = req.body;
  // res.json(req.body);
  // jsson=res.json(req.body)
  // console.log(jsson)
  const username = req.body.user_name;
  const password = req.body.pass_word;
  // const pfp = req.body.pfp;
  // const bio = req.body.bio;

  console.log(username);
  // Check if username is unique
  db.get(
    "SELECT * FROM users WHERE (username, password) IN ( VALUES (?, ?))",
    [username, password],
    (err, row) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      } else if (row) {
        // Username already exists
        console.log("row found");
        res
          .status(200)
          .json({ message: "Login successful.Directing to main page" });
      }
    }
  );
  console.log("log up successful");
});

app.post("/tab_page_request", (req, res) => {
  console.log("getting data for table:tab_page_request");
  const num_start = parseInt(req.body.start);
  const finish = req.body.finish;
  console.log(num_start);
  console.log(finish);
  const query =
    "SELECT * FROM menuItems" +
    " ORDER BY Book_Author,Book_Title limit " +
    num_start.toString() +
    "," +
    finish.toString();
  console.log(query);
  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
      return;
    }
    console.log("sending");
    res.json(rows);
  });
});

const { promisify } = require("util");

const dbRun = promisify(db.run.bind(db));
const dbAll = promisify(db.all.bind(db));

app.use(express.json());
app.post("/getMenuItems", async (req, res) => {
  try {
    const { username } = req.body;
    const collectionResult = await queryDatabase(
      `SELECT collection FROM users WHERE username = ?`,
      [username]
    );
    const collectionArray =
      collectionResult.length > 0
        ? collectionResult[0].collection.split(",")
        : [];
    console.log(collectionArray);
    const menuItemsResult = await queryDatabase(
      `SELECT * FROM menuItems WHERE ISBN IN (${collectionArray
        .map(() => "?")
        .join(", ")})`,
      collectionArray
    );

    res.json(menuItemsResult);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
function queryDatabase(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function get_all_emails() {
  const emails = (
    await db.all("SELECT * FROM menuItems " + " WHERE ISBN= ?", [])
  ).map((row) => row.collections);

  return emails;
}

app.post("/selectorFill", (req, res) => {
  const type = req.body.type;
  console.log(type);
  const query =
    "SELECT " + type + " FROM menuItems" + " ORDER BY Book_Author,Book_Title";
  console.log(query);
  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).send(err.message);
      return;
    }
    console.log("sending");
    res.json(rows);
  });
});

app.post("/addCollection", (req, res) => {
  console.log("collection add began t");
  console.log('adding books')
  const user_name = req.body.user_name;
  const ISBN = req.body.ISBN;
  console.log(user_name);
  console.log(ISBN);
  db.get(
    "SELECT * FROM users WHERE (username) IN ( VALUES (?))",
    [user_name],
    (err, row) => {
      if (err) {
        res.status(400).send("errror 400");
        console.log("error was sent");
        return;
      }
      if (row) {
        // Username already exists
        console.log("row codition met:" + row.toString());
        // updaterow=row+","+ISBN;
        // db.run('UPDATE users SET collection ="'+updaterow+'" WHERE username='+'"'+user_name+'"')
        forrun =
          "UPDATE users SET collection = collection || " +
          "'" +
          ISBN +
          "," +
          "'" +
          " WHERE username=" +
          '"' +
          user_name +
          '"';
        console.log(forrun);
        db.run(forrun);

        console.log("update ran");
      } else {
        console.log("login failed");
      }
    }
  );
});

app.post("/removeCollection", async (req, res) => {
  username = req.body.user_name;
  isbn = req.body.ISBN;
  const collectionResult = await queryDatabase(
    `SELECT collection FROM users WHERE username = ?`,
    [username]
  );
  const collectionArray =
    collectionResult.length > 0
      ? collectionResult[0].collection.split(",")
      : [];
  console.log(
    collectionArray.filter(function (a) {
      return (a !== isbn) | "" | '"';
    })
  );
  console.log(typeof isbn);
  console.log(typeof "butt".toString());
  collectionArray2 = collectionArray.filter(function (a) {
    return a.toString() !== isbn.toString();
  });
  console.log("isbn at 0:" + collectionArray2[0]);
  const updatedCollection = await collectionArray2.join(",");

  try {
    // query='SELECT * FROM users WHERE username="'+username+'"'
    // // Retrieve the current collection for the userc
    // console.log(query)
    // const userData = await db.get(query);
    // await console.log('char at 0:'+userData[0])
    // If user not found, return an error
    if (!collectionArray) {
      console.log("user not found");
      res.status(404).json({ error: "User not found" });
      return;
    } else {
      //.replaceAll('"','').replaceAll(',,',',').replaceAll(',,',',').replaceAll(',,',',')
      // const collectionResult = await queryDatabase(`SELECT collection FROM users WHERE username = ?`, [username]);

      // console.log('Current collection:', currentCollection);

      // Remove the specified ISBN from the collection

      // Update the collection in the database
      await db.run("UPDATE users SET collection = ? WHERE username = ?", [
        updatedCollection,
        username,
      ]);
    }

    res.json({ success: true, updatedCollection });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/search", (req, res) => {
  console.log("getting data for table:search");
  const search_term = req.body.search_term;
  const type = req.body.type;

  // const type='Book_Title'
  console.log(search_term);
  ///expression [ NOT ] SIMILAR TO pattern [ ESCAPE 'escape_char' ]
  //  const query = 'SELECT * FROM menuItems where '+type+' SIMILAR TO pattern '+ search_term;
  //  const query = 'SELECT * FROM menuItems WHERE '+type+' LIKE '+ '%'+search_term+ '%';

  const query =
    "SELECT * FROM menuItems WHERE " +
    type +
    ' LIKE "%' +
    search_term +
    '%"' +
    "COLLATE SQL_Latin1_General_CP1_CI_AS";
  console.log(query);
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    console.log("sending");
    res.json(rows);
  });
});

app.post("/search", (req, res) => {
  console.log("getting data for table:search");
  const search_term = req.body.search_term;
  const type = req.body.type;

  // const type='Book_Title'
  console.log(search_term);
  ///expression [ NOT ] SIMILAR TO pattern [ ESCAPE 'escape_char' ]
  //  const query = 'SELECT * FROM menuItems where '+type+' SIMILAR TO pattern '+ search_term;
  //  const query = 'SELECT * FROM menuItems WHERE '+type+' LIKE '+ '%'+search_term+ '%';

  const query =
    "SELECT * FROM menuItems WHERE " +
    type +
    ' LIKE "%' +
    search_term +
    '%"' +
    "COLLATE SQL_Latin1_General_CP1_CI_AS";
  console.log(query);
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    console.log("sending");
    res.json(rows);
  });
});

app.post("/updatelocalCollectionlist", (req, res) => {
  console.log("updatelocalCollectionlist");
  const username = req.body.user_name;
  const password = req.body.pass_word;

  // const type='Book_Title'
  ///expression [ NOT ] SIMILAR TO pattern [ ESCAPE 'escape_char' ]
  //  const query = 'SELECT * FROM menuItems where '+type+' SIMILAR TO pattern '+ search_term;
  //  const query = 'SELECT * FROM menuItems WHERE '+type+' LIKE '+ '%'+search_term+ '%';

  db.get(
    "SELECT * FROM users WHERE (username) IN ( VALUES (?))",
    [username],
    (err, row) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      } else if (row) {
        // Username already exists
        res.json(row);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// db.all(query, [], (err2, row2) => {
//   if (err2) {
//     console.log("SQL ERROR.Likely book not found:"+array[i])
//     // res.status(500).send(err2.message);
//   } else if(row2){
//       // console.log(row2)
//       if(i==array.length){
//         console.log("sending")
//         if(i=0){
//         rows='{'

//         }
//         res.json(rows);

//       }
//       rows.push(row2)
//       console.log(i)
//     }
// });

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

// function loadCollection(username){
//   db.get('SELECT * FROM users WHERE (username) IN ( VALUES (?))', [username], (err, row) => {
//     console.log("running loadcollection")
//     if (err) {
//       console.log("this error")
//       res.status(500).send(err.message);
//     }
//     else if (row) {
//       // Username already exists
//       console.log("row found")
//       console.log(row.collection)
//       var array=row.collection.replaceAll("'","").replaceAll('"',"").replaceAll(',,',",").replaceAll(',,',",").replaceAll(',,',",").replaceAll(',,',",").replaceAll(' ',"").split(",")
//       console.log(array)
//       filtered=array.filter(function(item){
//           return item.length>1

//       } )
//       return filtered;
//     }
//   });
// }

// app.post('/removeCollection', (req, res) => {
//   console.log('collection add began t')
//   const user_name = req.body.user_name;
//   const ISBN = req.body.ISBN;
//  console.log(user_name)
//  console.log(ISBN)
//  db.get('SELECT collection FROM users WHERE (username) IN ( VALUES (?))', [user_name], (err, row) => {
//   if (err) {
//     res.status(400).send("errror 400");
//     console.log('error was sent')
//     return;
//   }
//   if (row) {
//     // Username already exists
//     console.log('row codition met:'+row)
//     // quiry="SELECT * FROM users WHERE username = '"+ user_name +"';"
//     // console.log(quiry)
//     string_returned=JSON.stringify(row.collection)
//     array=string_returned.split(',')
//     for_send_assing=""
//     for(let i=0;i<array.length;i++){
//         if(array[i]==ISBN){
//         }else{
//           console.log(i)
//           console.log(array[i])
//           for_send_assing=for_send_assing+array[i]+','
//         }}
//         for_send_assing = for_send_assing.replace('"', '');
//         for_send_assing = for_send_assing.replace('"', '');
//         console.log(for_send_assing)
//         forrun='UPDATE users SET collection='+'"'+for_send_assing+'"'+' WHERE username= '+'"'+user_name+'"';
//         console.log(forrun)
//         db.run(forrun)
//         res.send()
//   }else{ console.log("login failed");
// }
// });
// });


//080652121X this isbn wasnt found. need to find out why that is
// app.post('/failed', (req, res) => {
//   console.log('getting data for table:loadCollection')
//   const username = req.body.username;
//   console.log(username)
// ///go back and make for loop async
//   db.get('SELECT * FROM users WHERE (username) IN ( VALUES (?))', [username], (err, row) => {
//     if (err) {
//       console.log("this error")
//       res.status(500).send(err.message);
//     }
//     else if (row) {
//       // Username already exists
//       console.log("row found")
//       console.log(row.collection)
//       var array=row.collection.replaceAll("'","").replaceAll('"',"").replaceAll(',,',",").replaceAll(',,',",").replaceAll(',,',",").replaceAll(',,',",").replaceAll(' ',"").split(",")
//       console.log(array)
//       array=array.filter(function(item){
//           return item.length>1

//       })
//       var rows= '{}'
//       console.log(array.length)
//       for(let i=0;i<=array.length;i++){
//         const query = 'SELECT * FROM menuItems '+' WHERE ISBN="'+array[i]+'"';
//         console.log(query)

//     }
//     }

//   });
// });

// const sqlite3 = require('sqlite3').verbose();