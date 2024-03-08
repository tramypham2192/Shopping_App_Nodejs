require('dotenv').config();
const {SERVER_PORT, CONNECTION_STRING} = process.env;
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = new Sequelize(
    CONNECTION_STRING,
    {
        dialect: 'postgres',
        // dialectOptions: {
        // ssl: {
        //     rejectUnauthorized: false
        // }
        // }
    });

const express = require('express');
const cors = require('cors');
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const passport = require("passport");
const { Strategy } = require('passport-local');
const { 
    // getAllProductsWithSession,
    increaseProductQuantity,
    decreaseProductQuantity,
    register,
    // loginUsingCookieAndStrategy
  } = require('./controller.js');

//---------------------------------------------- MIDDLEWARE ----------------------------------------------//

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 1 // 1000 miliseconds - 1s, 60 means 1 minute, then 60 means 1 hour, 1 hours: one hour length cookie
    // }
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('../client')); 

// these middleware must be after creating a session
app.use(passport.initialize());
app.use(passport.session());

//---------------------------------------------- GET METHOD ----------------------------------------------//
app.get('/login', (req, res) => res.redirect("../html/register-login/login.html"));
app.get('/loginFailed', (req, res) => res.redirect("../html/loginFailed.html"));

// app.get('/products', getAllProductsWithSession);
app.get('/increase_product_quantity/:product_id/:product_quantity', increaseProductQuantity);
app.get('/decrease_product_quantity/:product_id/:product_quantity', decreaseProductQuantity);

// use cookie and session to allow user access /cart if logged in successully
app.get("/cart", (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("../html/cart.html");
    } else {
      app.get("/login", login);
    }
  })
  
app.get("/products", (req, res) => {
  console.log('req.user is ' + req.user);
  if (req.isAuthenticated()) {
    console.log('passportjs shows user input correct username and password!');
    console.log("username input is " + req.user.user_email);
    console.log("password input is " + req.user.user_password);
    res.render("/products");
} else {
    console.log('passportjs show that user input invalid username or password');
    res.redirect("/login");
  }
});

//---------------------------------------------- POST METHOD ----------------------------------------------//

app.post('/register', register);

app.post(
  "/login", (req, res) => {
    console.log('at least log smt');
    passport.authenticate("local", {
      successRedirect: "/products",
      failureRedirect: "/loginFailed",
    });  
    
  });

  passport.use(
    new Strategy(async function verify(username, password, cb) {
      try {
        const result = await db.query("SELECT * FROM users WHERE user_email = $1 ", [
          username,
        ]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.user_password;
          bcrypt.compare(password, storedHashedPassword, (err, valid) => {
            if (err) {
              //Error with password check
              console.error("Error comparing passwords:", err);
              return cb(err);
            } else {
              if (valid) {
                //Passed password check
                return cb(null, user);
              } else {
                //Did not pass password check
                return cb(null, false);
              }
            }
          });
        } else {
          return cb("User not found");
        }
      } catch (err) {
        console.log(err);
      }
    })
  );

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(SERVER_PORT, () => console.log(`server is running on port ${SERVER_PORT}`));

