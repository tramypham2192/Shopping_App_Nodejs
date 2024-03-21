const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pg = require("pg");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Strategy } = require("passport-local");
const session = require("express-session");
require("dotenv").config();

const app = express();
const port = 4000;

// CREATE A SESSION
const {SECRET} = process.env;
app.use(
  session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1000 miliseconds - 1s, 60 means 1 minute, then 60 means 1 hour, 24 hours: one day length cookie
    },
  }),
);

// DISPLAY UI
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", express.static("../client"));

// INTIALIZE A PASSPORT OBJECT
app.use(passport.initialize());
app.use(passport.session());

// CONNECT TO DATABASE
const {CONNECTION_STRING} = process.env;
const { Sequelize } = require("sequelize");
const db = new Sequelize(CONNECTION_STRING);


// CALL FUNCTION IN SEED.JS
const { seedProducts, seedUsers } = require("./seed.js");

// CALL FUNCTION IN CONTROLLER.JS
const controller = require("./controller.js");

// --------------------PRODUCTS REQUESTS--------------------
app.get("/productList", controller.getAllProductsWithSession);

app.get("/products", (req, res) => {
  console.log(
    "user after calling /products is " +
      req.user.user_firstname +
      " " +
      req.user.user_lastname,
  );
  if (req.isAuthenticated()) {
    res.redirect("../html/productList.html");
  } else {
    res.redirect("/login");
  }
});

app.get("/searchProduct/:keyword", controller.searchProduct);

app.get("/getSearchProduct", controller.getSearchProduct);

// --------------------CART REQUESTS--------------------
app.get("/getCart", controller.getCart);

app.post("/insertIntoCart", controller.insertIntoCart);

app.post(
  "/decreaseProductQuantityInCart",
  controller.decreaseProductQuantityInCart,
);

app.post(
  "/increaseProductQuantityInCart",
  controller.increaseProductQuantityFunction,
);

// --------------------ORDER REQUESTS--------------------
app.post("/order", controller.createOrder);

// --------------------LOGIN REQUESTS--------------------
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

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/login",
  }),
);

// PASSPORT.JS
passport.use(
  new Strategy(async function verify(username, password, cb) {
    console.log("username after calling verify function is " + username);
    try {
      const result = await db.query(
        "SELECT * FROM users WHERE user_email = $1 ",
        [username],
      );
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
  }),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  cb(null, user);
});

// --------------------REGISTER REQUESTS--------------------
app.post("/register", controller.register);

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email],
    );

    if (checkResult.rows.length > 0) {
      req.redirect("/login");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          const result = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
            [email, hash],
          );
          const user = result.rows[0];
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/products");
          });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
