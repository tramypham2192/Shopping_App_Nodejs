// Link with database
require('dotenv').config()
const {seed} = require('./seed');
// SET UP A SERVER WITH EXPRESS
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/', express.static('../client')); 

const { getAllProducts } = require('./controller.js')

const {SERVER_PORT} = process.env;
app.listen(SERVER_PORT, () => console.log(`server is running on port ${SERVER_PORT}`));

// ROUTES
app.get('/', function(req,res) {
    res.sendfile('client/html/index.html');
  });

app.get('/products', getAllProducts);