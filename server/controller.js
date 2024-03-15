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
    
    // -----------------------------------PRODUCTS----------------------------------- //

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
        await sequelize.query(`
            select COALESCE(user_id, ${req.user.user_id}) as user_id, products.product_id, product_name, product_imagepath,  product_description, product_price, COALESCE(product_quantity::int, 0) as product_quantity
            from products
            left join
            (SELECT DISTINCT                             
                user_id,
                value->'product_id' AS product_id,
                value->'product_quantity' AS product_quantity
            FROM carts,
            jsonb_array_elements(carts.products_in_cart
            )
            where user_id = ${req.user.user_id}) processed_carts 
            on processed_carts.product_id::int = products.product_id
            order by products.product_id;     
        `)
        .then((dbres) => {
            console.log(dbres[0]);
            return res.status(200).send(dbres[0]);
        })
        .catch(err => console.log(err));
    },

    // -----------------------------------USERS----------------------------------- //

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
                    .then(dbres => res.status(200).send("User register successfully!"));
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
                } else {
                    if (result) {
                        return cb(null, user);
                    } else {
                        return cb(null, false);
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

    // -----------------------------------CARTS----------------------------------- //

    getCart: async (req, res) => {
        let user_id = req.user.user_id;
        let products_and_quantities = [];
        let responseData = [];
        let user_firstname = "";
        await sequelize.query(`
            select user_firstname from users where user_id = ${user_id};
        `)
        . then(dbres => user_firstname = dbres[0][0].user_firstname);
        console.log('user_firstname from /getCart is ', user_firstname);
        await sequelize.query( 
            `
            select user_id, products.product_id, product_name, product_price, product_quantity 
            from
            (SELECT DISTINCT                             
                user_id,
                value->'product_id' AS product_id,
                value->'product_quantity' AS product_quantity
            FROM carts,
            jsonb_array_elements(carts.products_in_cart)) processed_carts
            inner join products on processed_carts.product_id::int = products.product_id
            where user_id = ${user_id}
            order by products.product_id;
            `)
        .then((dbres) => {
            console.log("product_name and product_quantity in carts is ", dbres[0]);
            for (element of dbres[0]){
                responseData.push(element);
            }
        })
        .catch(err => console.log(err));
        console.log('responseData is ', responseData);
        return res.status(200).send([{user_firstname: user_firstname}, responseData]); 
    },



    insertIntoCart: async (req, res) => {  
        let user_id = req.user.user_id;
        let productId = req.body.product_id; 
        let products_in_cart = ""; 
        await sequelize.query(`select products_in_cart from carts where user_id = ${user_id};`)  
                .then(dbres => {
                    products_in_cart = dbres[0];  
                });                    
            
            if(products_in_cart == ""){ 
                await sequelize.query(`INSERT INTO carts (user_id, products_in_cart)
                        values (${user_id}, 
                            jsonb_build_array(json_build_object('product_id', ${productId}, 'product_quantity', ${1})) ::jsonb
                            );`)
                .then((dbres) => {
                    console.log("insert new product into cart: ");  
                    res.status(200).send(`insert new product into cart successfully! Product_id is " ${productId}, " Product_quantity is ", ${1}`); 
                }) 
            }
            else {    
                 // CONSOLE.LOG TO SEE THE CONTENT OF products_in_cart in order to know if can use find() functions on it or not  
                // console.log('products_in_cart currently is ', JSON.stringify(products_in_cart), "\n");   
                const arr = products_in_cart;
                const products_and_quantities = arr[0].products_in_cart;     
                // console.log('products_and_quantities is ', products_and_quantities, "\n"); 
                // console.log('type of products_and_quantities is ', Array.isArray(products_and_quantities)); 
                let checkExistingProductInCart = products_and_quantities.find((element) => {return element.product_id == productId}) 
                // console.log('check Existing Product In Cart is ', checkExistingProductInCart); 
                // console.log('products_and_quantities is ', products_and_quantities, "\n"); 
                // console.log('type of products_and_quantities is Array?: ', Array.isArray(products_and_quantities)); 
                if (checkExistingProductInCart == null){
                    await sequelize.query(`           
                    update carts 
                    set products_in_cart = products_in_cart || json_build_object('product_id', ${productId}, 'product_quantity', ${1})::jsonb
                    where user_id = ${user_id};`)
                    .then((dbres) => {  
                        console.log('add more products into cart: ');
                        res.status(200).send(`add more products into cart successfully! Product_id is " ${productId}, " Product_quantity is ", ${1}`);
                    })
                } else if (checkExistingProductInCart != null && checkExistingProductInCart.product_quantity == 0) {
                    let updateObj = products_and_quantities.find((element) => {return element.product_id == productId}) 
                    // console.log('updateObj is ', updateObj);     
                    if (updateObj != null){ 
                        const updateIndex = products_and_quantities.findIndex((product) => {
                            return product == updateObj;
                        });  
                        // console.log('updateIndex is ', updateIndex);    
                        await sequelize.query(`update carts set products_in_cart = jsonb_set(products_in_cart, '{${updateIndex}}' , '{"product_id": ${productId}, "product_quantity": ${1}}');`)
                        .then((dbres) => {
                            // console.log('update product quantity in cart: ');
                            res.status(200).send(`update product quantity in cart successfully! Product_id is " ${productId}, " Product_quantity is ", ${1}`);
                        })
                }
            }
        }
    },



    decreaseProductQuantityInCart: async (req, res) => {
        console.log('decreaseProductQuantityInCart function is called');
        console.log('req is ', req);
        let productId = +req.body.product_id; 
        let product_quantity = +req.body.product_quantity;
        let new_product_quantity = 0;
        if (product_quantity >= 1){
            new_product_quantity = product_quantity - 1;
        }
        
        let products_in_cart = ""; 
        await sequelize.query(`select products_in_cart from carts where user_id = ${req.user.user_id};`)  
                .then(dbres => {
                    products_in_cart = dbres[0];  
                });                    
        // CONSOLE.LOG TO SEE THE CONTENT OF products_in_cart in order to know if can use find() and filter() functions on it or not  
        // console.log('products_in_cart currently is ', JSON.stringify(products_in_cart), "\n");   
        const arr = products_in_cart;      
        const products_and_quantities = arr[0].products_in_cart;     
        // console.log('products_and_quantities is ', products_and_quantities, "\n"); 
        // console.log('type of products_and_quantities is ', Array.isArray(products_and_quantities)); 
        let updateObj = products_and_quantities.find((element) => {return element.product_id == productId}) 
        // console.log('updateObj is ', updateObj);     
        if (updateObj != null){ 
            const updateIndex = products_and_quantities.findIndex((product) => {
                return product == updateObj;
            });  
            // console.log('updateIndex is ', updateIndex);    
            await sequelize.query(`update carts set products_in_cart = jsonb_set(products_in_cart, '{${updateIndex}}' , '{"product_id": ${productId}, "product_quantity": ${new_product_quantity}}');`)
            .then((dbres) => {
                // console.log('update product quantity in cart: ');
                res.status(200).send(`update product quantity in cart successfully! Product_id is " ${productId}, " Product_quantity is ", ${new_product_quantity}`);
            })
        }   
    },



    increaseProductQuantityFunction: async (req, res) => {
        console.log('increaseProductQuantityInCart function in controller.js is called');
        let productId = +req.body.product_id; 
        let product_quantity = +req.body.product_quantity;
        let new_product_quantity = product_quantity + 1;
        
        let products_in_cart = ""; 
        await sequelize.query(`select products_in_cart from carts where user_id = ${req.user.user_id};`)  
                .then(dbres => {
                    products_in_cart = dbres[0];  
                });                    
        // CONSOLE.LOG TO SEE THE CONTENT OF products_in_cart in order to know if can use find() and filter() functions on it or not  
        // console.log('products_in_cart currently is ', JSON.stringify(products_in_cart), "\n");   
        const arr = products_in_cart;      
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
            await sequelize.query(`update carts set products_in_cart = jsonb_set(products_in_cart, '{${updateIndex}}' , '{"product_id": ${productId}, "product_quantity": ${new_product_quantity}}');`)
            .then((dbres) => {
                console.log('update product quantity in cart: ');
                res.status(200).send(`update product quantity in cart successfully! Product_id is " ${productId}, " Product_quantity is ", ${new_product_quantity}`);
            })
        }   
    },

    // -----------------------------------ORDERS----------------------------------- //

    createOrder:  async (req, res) => {      

    }
}

// module.exports.getAllProducts(); // call this function to console.log the res and dbres[0], to check if query execute successfully
// module.exports.increaseProductQuantity();
// module.exports.register();
// module.exports.login();

