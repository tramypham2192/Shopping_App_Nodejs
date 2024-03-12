require('dotenv').config();
const {CONNECTION_STRING} = process.env;
const Sequelize = require('sequelize');
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
const bcrypt = require('bcrypt');
const session = require('express-session');
const passport = require("passport");
const { Strategy } = require('passport-local');
let checkLogInSuccessWithoutSession = false;

app.use(express.json());
app.use(cors());

// create session to save user’s login session
app.use(session({ // create a new instance
	secret: "passwordDoMinhTuDat",
	resave: false,
	saveUninitialized: true 
	})
);

app.use (passport.initialize());
app.use(passport.session()); 

module.exports = {
    getCart: async (req, res) => {
        const productId = +req.body.product_id;
        await sequelize.query(`Select * from products WHERE product_id = '${productId}';`)
        .then((dbres) => {
            console.log(dbres[0]);
            return res.status(200).send(dbres[0]);
        })
        .catch(err => console.log(err));
    },

    getAllProducts: (req, res) => {
        if (checkLogInSuccessWithoutSession == true) {
            sequelize.query(`Select * from products ORDER BY product_id;`)
            .then((dbres) => {
                console.log(dbres[0]);
                // console.log(res);
                return res.status(200).send(dbres[0]); 
            })
            .catch(err => console.log(err));
        }
        else if (checkLogInSuccessWithoutSession == false) {
            res.status(403).send("Logged in unsuccessfully!");
        }
    },

    getAllProductsWithSession: async (req, res) => {
        await sequelize.query(`Select * from products ORDER BY product_id;`)
        .then((dbres) => {
            console.log(dbres[0]);
            return res.status(200).send(dbres[0]);
        })
        .catch(err => console.log(err));
    },
    
    increaseProductQuantity: (req, res) => {
        let new_product_quantity = +req.params.product_quantity;
        sequelize.query(`select product_quantity from products where product_id = ${+req.params.product_id};`)
            .then(dbres => {
                console.log('dbres[0] is: ' + dbres);
                new_product_quantity = dbres[0];
            })
            .catch(err => console.log(err));
        console.log("new product_quantity is: " + new_product_quantity);
        sequelize.query(`update products set product_quantity = ${new_product_quantity + 1} where product_id = ${+req.params.product_id};`)
            .then(dbres => {
                res.status(200).send(dbres[0]);
            })
            .catch(err => console.log(err));
    },

    decreaseProductQuantity: (req, res) => {
        let new_product_quantity = +req.params.product_quantity;
        console.log(+req.params.product_id);
        sequelize.query(`select product_quantity from products where product_id = ${+req.params.product_id} product_id = ${+req.params.product_id};`)
            .then(dbres => {
                new_product_quantity = dbres[0];
            }) 
            .catch(err => console.log(err));
        sequelize.query(`update products set product_quantity = ${new_product_quantity - 1};`)
            .then(dbres => {
                res.status(200).send(dbres[0]);
            })
            .catch(err => console.log(err));
    },

    register: async (req, res) => {
        console.log('calling register function in controller.js!');
        const saltRounds = 10;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const email = req.body.email;
        const password = req.body.password;
        console.log('username in controller.js is ' + email);

        // step 1: check if email has already exist in table users or not
        const emailList = await sequelize.query(`select user_email from users;`)
        .then((dbres) => dbres[0].map((el) => {
            return el.user_email;
          }));
        if (!(emailList.includes(email))){
            // step 2: hash password
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.log('password is ' + password);
                    console.log('salt is ' + saltRounds);
                    console.log('Error hashing password:', err);
                } else {
                    console.log('Hashed password:', hash); 
                    // step 3: save new user into table users
                    sequelize.query(`INSERT INTO users (user_firstname, user_lastname, user_email, user_password)
                    values ('${firstname}', '${lastname}', '${email}', '${hash}');`)
                    .then(res => {console.log('User registered successfully!');})
                }
            })
        }
        else if (emailList.includes(email)){
            res.send("This email attached to an existing account! Please use another email!");
        }
    },

    login: async (req, res) => {
        const email = req.body.email;
        const loginPassword = req.body.password;
        // step 1: find user in table users based on email
        let storedPassword = "";
        await sequelize.query(`select user_password from users where user_email = '${email}';`)
        .then(dbres => {
            console.log(dbres[0]);
            storedPassword = dbres[0][0].user_password;
        });
        // step 2: verify the password
        bcrypt.compare(loginPassword, storedPassword, (err, result) => {
            if (err){
                console.error('Error comparing passwords: ', err);
            } else {
                if (result) {
                    checkLogInSuccessWithoutSession = true;
                    res.status(200).send('User log in successfully!'); 
                    console.log('User log in successfully!'); 
                } else {
                    res.status(200).send('Invalid email or password');
                    console.log('Invalid email or password');
                }
            }
        })
    },

    loginUsingCookieAndStrategy: (req, res) => {
        // register a sttrategy
        passport.use(new Strategy(async function verify(username, passport, cb) {
            // this part is authenticate email and password based on user's info inside database
            const email = req.body.email;
            const loginPassword = req.body.password;
            // step 1: find user in table users based on email
            let storedPassword = "";
            await sequelize.query(`select user_password from users where user_email = '${email}';`)
            .then(dbres => {
                console.log(dbres[0]);
                storedPassword = dbres[0][0].user_password;
            });
            // step 2: verify the password
            bcrypt.compare(loginPassword, storedPassword, (err, result) => {
                if (err){
                    return cb(err);
                    console.error('Error comparing passwords: ', err);
                } else {
                    if (result) {
                        return cb(null, user);
                        res.status(200).send('User log in successfully!'); 
                        console.log('User log in successfully!'); 
                    } else {
                        return cb(null, false);
                        res.status(200).send('Invalid email or password');
                        console.log('Invalid email or password');
                    }
                }
            })
            }));

            passport.serializeUser((user, cb) => {
                cb(null, user);
            });

            passport.deserializeUser((user, cb) => {
                cb(null, user);
            })
    },

    createCart: async (req, res) => {
        // console.log('req.user.user_id is ', req.user.user_id);
        let productId = req.body.product_id;
        console.log('product_id in controller.js is ' + productId);
        let product_quantity = req.body.product_quantity;
        console.log('product_quantity in controller.js is ' + product_quantity);

        // let products_in_cart = await sequelize.query(`
        //     select products_in_cart from carts where user_id = ${req.user.user_id};`)
        //         .then(dbres => {
        //             console.log('products_in_cart keys currently is ' + Object.keys(dbres[0]));
        //             console.log('products_in_cart values currently is ' + Object.values(dbres[0])["product_id"]);
        //         });    
        let products_in_cart = "";
        await sequelize.query(`
            select products_in_cart from carts where user_id = 1;`)
                .then(dbres => {
                    products_in_cart = dbres[0];
                });      
        // CONSOLE.LOG TO SEE THE CONTENT OF products_in_cart in order to know if can use find() and filter() functions on it or not  
        console.log('products_in_cart currently is ', JSON.stringify(products_in_cart), "\n"); 
        const arr = products_in_cart;
        // console.log(arr[0].products_in_cart); 
        // console.log('');
        
        if(products_in_cart == ""){ 
            await sequelize.query(`INSERT INTO carts (user_id, products_in_cart)
                    values (1, 
                        jsonb_build_array(json_build_object('product_id', ${productId}, 'product_quantity', ${product_quantity})) ::jsonb
                        );`)
        }
        else { 
            const products_and_quantities = arr[0].products_in_cart;     
            console.log('products_and_quantities is ', products_and_quantities, "\n"); 
            console.log('type of products_and_quantities is ', Array.isArray(products_and_quantities)); 
            let updateObj = products_and_quantities.find((element) => {return element.product_id == productId}) 
            console.log('updateObj is ', updateObj);
            if (updateObj != null){ 
                const updateIndex = products_and_quantities.findIndex((product) => {
                    return product == updateObj;
                });
                console.log('updateIndex is ', updateIndex);    
                await sequelize.query(`update carts set products_in_cart = jsonb_set(products_in_cart, '{${updateIndex}}' , '{"product_id": ${productId}, "product_quantity": ${product_quantity}}');`)
            }
            else {      
                await sequelize.query(`
                update carts 
                set products_in_cart = products_in_cart || json_build_object('product_id', ${productId}, 'product_quantity', ${product_quantity})::jsonb
                where user_id = ${1}
            ;`)
            }
        };
        // console.log('products_in_cart is : product_id is ' + products_in_cart.data.productId + " and product_quantity is " + products_in_cart.data.product_quantity);
    },

    createOrder:  async (req, res) => {

    }
}

// module.exports.getAllProducts(); // call this function to console.log the res and dbres[0], to check if query execute successfully
// module.exports.increaseProductQuantity();
// module.exports.register();
// module.exports.login();
