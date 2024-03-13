const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pg = require('pg');
const bcrypt = require('bcrypt');
const passport = require('passport');
const  {Strategy}  = require('passport-local');
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 4000;

// CREATE A SESSION
app.use(
  session({
    secret: "TOPSECRETWORD",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1000 miliseconds - 1s, 60 means 1 minute, then 60 means 1 hour, 24 hours: one day length cookie
    }
  })
);

// DISPLAY UI
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('../client')); 

// INTIALIZE A PASSPORT OBJECT
app.use(passport.initialize());
app.use(passport.session());

// CONNECT WITH DATABASE
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "shopping_app",
  password: "new_password",
  port: 5432,
});
db.connect();

// CALL FUNCTION IN SEED.JS
const {seedProducts, seedUsers} = require('./seed.js');

// CALL FUNCTION IN CONTROLLER.JS
const { 
    getAllProductsWithSession,
    increaseProductQuantity,
    decreaseProductQuantity,
    register,
    getCart,
    createOrder,
    createCart
  } = require('./controller.js');

// --------------------GET REQUESTS--------------------

// log in - register - log out
app.get("/login", (req, res) => {
  res.redirect("../html/register-login/login.html");
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// // products-related requests
app.get("/productList", getAllProductsWithSession);

app.get("/products",  (req, res) => {
  console.log("user after calling /products is " + req.user.user_firstname + " " + req.user.user_lastname);
  if (req.isAuthenticated()) {
    res.redirect("../html/productList.html");
  } else {
    res.redirect("/login");
  }
});

app.get('/increase_product_quantity/:product_id/:product_quantity', increaseProductQuantity);

app.get('/decrease_product_quantity/:product_id/:product_quantity', decreaseProductQuantity);  

// // cart requests
app.get("/cart", getCart);

// app.get("/cart", (req, res) => {
//   console.log('req.user when accessing /cart is ' + req.user.user_firstname + " " + req.user.user_lastname);
//   getCart;
// })

// // --------------------POST REQUESTS--------------------
app.post('/register', register);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/login",
  })
);

app.post("/order", createOrder);

app.post("/cart", createCart);

// app.post("/register", async (req, res) => { 
//   const email = req.body.username;
//   const password = req.body.password;

//   try {
//     const checkResult = await db.query("SELECT * FROM users WHERE user_email = $1", [
//       email,
//     ]);

//     if (checkResult.rows.length > 0) {
//       req.redirect("/login");
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error("Error hashing password:", err);
//         } else {
//           const result = await db.query(
//             "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
//             [email, hash]
//           );
//           const user = result.rows[0];
//           req.login(user, (err) => {
//             console.log("success");
//             res.redirect("/products");
//           });
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err); 
//   }
// });

passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log('username after calling verify function is ' + username);
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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

