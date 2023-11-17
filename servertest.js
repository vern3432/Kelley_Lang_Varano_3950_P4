const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const expressSession = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3001;

// SQLite Database Setup
const dbPath = path.resolve(__dirname, 'memory.db');
const userDbPath = path.resolve(__dirname, 'user.db');
const db = new sqlite3.Database(dbPath);
const userDb = new sqlite3.Database(userDbPath);
app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// passport.use(new GoogleStrategy({
//   clientID: 'your-client-id',
//   clientSecret: 'your-client-secret',
//   callbackURL: 'http://localhost:3001/auth/google/callback',
// },
// function (accessToken, refreshToken, profile, done) {
//   // Use profile information to create or update user in your database
//   // For simplicity, we'll just store the user's Google ID in the database
//   return done(null, profile.id);
// }));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// // Routes
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] })
// );

// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/' }),
//   function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});





app.get('/data', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  // Your data fetching logic here
  // For example:
  const query = 'SELECT * FROM menuItems';
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(rows);
  });
});



// Signup route
app.post('/signup', async (req, res) => {

  console.log('singing up ')

    const { username, password } = req.body;
  
    // Check if the username already exists
    const userQuery = 'SELECT * FROM users WHERE username = ?';
    userDb.get(userQuery, [username], async (err, existingUser) => {
      if (err) {
        res.status(500).send(err.message);
        return;
      }
      if (existingUser) {
        res.status(400).send('Username already exists. Please choose a different username.');
        return;
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Save user to the database
      const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
      console.log("Insertion error")
      userDb.run(insertQuery, [username, hashedPassword], (err) => {
        console.log("Insertion error")

        if (err) {
          res.status(500).send(err.message);
          return;
        }
        res.sendStatus(200);
      });
    });
  });
  
// Login route
app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/',
  failureFlash: true,
}));



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
