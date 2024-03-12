// Link with database
require('dotenv').config()
const {seedProducts, seedUsers} = require('./seed');

// SET UP A SERVER WITH EXPRESS
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/', express.static('../client')); 

const { 
  getAllProducts,
  increaseProductQuantity,
  decreaseProductQuantity,
  register,
  login,
  loginUsingCookieAndStrategy
} = require('./controller.js');


const {SERVER_PORT} = process.env;

// ROUTE

app.get('/products', getAllProducts);
app.get('/increase_product_quantity/:product_id/:product_quantity', increaseProductQuantity);
app.get('/decrease_product_quantity/:product_id/:product_quantity', decreaseProductQuantity); 

// use cookie and session to allow user access /cart if logged in successully
app.get("/cart", (req, res) => {
  if (req.isAuthenticated()) {
    loginUsingCookieAndStrategy; 
  } else {
    app.get("/login", login);
  }
})

app.post('/register', register);
app.post('/login', login);

app.listen(SERVER_PORT, () => console.log(`server is running on port ${SERVER_PORT}`));
