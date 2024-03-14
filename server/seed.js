require('dotenv').config();
const {CONNECTION_STRING} = process.env;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING,
    {
        dialect: 'postgres',
        // dialectOptions: {
        // ssl: {
        //     rejectUnauthorized: false
        // }
        // }
    });

module.exports = {
    // table products has many-to-many with carts and orders
    seedProducts: (req, res) => {
        sequelize.query(`
            drop table if exists products;
            create table products (
                product_id serial primary key,
                product_name varchar(200),
                product_imagepath varchar(600),
                product_description varchar(1000),
                product_price integer
            );

            insert into products (product_name, product_imagePath, product_description, product_price)
            values (
                'Classic Matcha Latte',
                'https://images.unsplash.com/photo-1582785513054-8d1bf9d69c1a?q=80&w=2835&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'Classic Matcha Latte bring a unique and fresh taste for your day',
                9),
                ('Strawberry Matcha Latte',
                'https://media.istockphoto.com/id/1362041247/photo/raspberry-latte.webp?b=1&s=170667a&w=0&k=20&c=SYdbrGaDsF44TIUuV-yRi4IV7ya7O3YCrKfJ8PHN6No=',
                'Experience a unique and refreshing twist on a classic latte with our strawberry matcha latte! afternoon treat. Matcha is known for its antioxidant and energy-boosting properties, while the strawberries add a natural sweetness and a burst of vitamins. The creamy milk creates a smooth texture that perfectly complements the earthy flavor of the matcha and the sweet strawberries. Our strawberry matcha latte is a perfect choice for those looking for a unique and refreshing latte experience.',           
                8),
                ('Mango Matcha Latte',
                'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuZ28lMjBqdWljZXxlbnwwfHwwfHx8MA%3D%3D',
                'Experience a unique and refreshing twist on a classic latte with our mango matcha latte! Made with high-quality matcha powder, combined with fresh and juicy homemade mango puree, this latte is a delicious and healthy way to start your day or enjoy as an afternoon treat. Matcha is known for its antioxidant and energy-boosting properties, while the mangoes add a natural sweetness and a burst of vitamins. The creamy milk creates a smooth texture that perfectly complements the earthy flavor of the matcha and the sweet mangoes. Our mango matcha latte is a perfect choice for those looking for a unique and refreshing latte experience.',
                7),
                ('Pink Delight',
                'https://images.unsplash.com/photo-1461107973086-9ca50bc9f429?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGluayUyMHNtb290aGllfGVufDB8fDB8fHww',
                '*Strawberry Smoothie* Made with fresh, ripe strawberries and blended to perfection with creamy half & half, our strawberry smoothie is a healthy treat that is packed with vitamins and antioxidants, making it the perfect way to start your day or refuel after a workout Contains Dairy (Non-dairy alternatives are available in the options)',
                11),
                ('Mango Tango',
                'https://images.unsplash.com/photo-1606673993554-a5f993a16e0d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1hbmdvJTIwanVpY2V8ZW58MHx8MHx8fDA%3D',
                '*Mango Smoothie* Savor the sweet, tropical taste of our mango smoothie! We start with perfectly ripe, juicy mangoes and blend them with creamy half & half until we get the velvety texture. Bursting with flavor and essential vitamins, this refreshing smoothie is a perfect healthy breakfast on the go or refuel after a workout. Contains Dairy (Non-dairy alternatives are available in the options)',
                12
                ),
                ('Avocado Smoothie',
                'https://media.istockphoto.com/id/1283542497/photo/creamy-smoothie-from-avocado-and-banana-in-glass-cups-with-paper-tubes-on-a-light-background.jpg?s=1024x1024&w=is&k=20&c=kWUwiMvYhs_orzihbuIkjKQ2XwJQlUZccaHIx9DZH_U=',
                'Indulge in the creamy and nutritious goodness of our avocado smoothie! Made with fresh and ripe avocados, blended with creamy half & half, our avocado smoothie is a healthy and delicious option for any time of day. Avocados are packed with essential vitamins and healthy fats, making this smoothie a perfect choice for a post-workout recovery drink or a nutritious breakfast. Contains Dairy',
                10);
        `)
        .then(() => {
            console.log('Table products created and inserted!');
        })
        .catch((err) => {
            console.log(err);
        });
    },

    hashPassword: (password, saltRounds) => {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
              console.error("Error hashing password:", err);
            } else {
              return hash;
            }
        })
    },

    seedUsers: (req, res) => {
        sequelize.query(`
            drop table if exists users;
            create table users (
                user_id serial primary key,
                user_firstname varchar(200),
                user_lastname varchar(600),
                user_email varchar(1000),
                user_password varchar(200),
                user_role varchar(50) default 'customer'
            ;)
        `) 
        .then((res) => {
            console.log('Table users created and seeded');
        })
        .catch((err) => {
            console.log(err);
        })
    },
    
    // middle table to create many-to-many relationship between table products and table orders
    createTableProducts_Orders: (req, res) => {
        sequelize.query(`
            drop table if exists products_orders;
            create table products_orders (
                products_orders_id serial primary key,
                product_id INTEGER NOT NULL REFERENCES products(product_id),
                order_id INTEGER NOT NULL REFERENCES orders(order_id)
            )        
        `)
        .then((res) => {
            console.log('Table products_orders (middle table in many-to-many relationship) created!');
        })
        .catch((err) => {
            console.log(err);
        })
    },

    createTableCart: (req, res) => {
        sequelize.query(`
            drop table if exists carts;
            create table carts (
                cart_id serial primary key,
                user_id INTEGER UNIQUE REFERENCES users(user_id),
                products_in_cart jsonb
            );
        `)
        .then((res) => {
            console.log('Table carts created!');
        })
        .catch((err) => {
            console.log(err);
        })
    },

    // orders is one-to-one with carts, many-to-many with products, and many-to-one with users
    createTableOrders: (req, res) => {
        sequelize.query(`
            drop table if exists orders;
            create table orders (
                order_id serial primary key,
                cart_id INTEGER UNIQUE REFERENCES carts(cart_id),
                user_id INTEGER NOT NULL REFERENCES  users(user_id),
                order_date TIMESTAMP, 
                products_in_cart jsonb, 
                pay_amount integer,
                status varchar(40)
            );
        `)
        .then((res) => {
            console.log('Table orders created!');
        })
        .catch((err) => {
            console.log(err);
        })
    },

    // middle table to create many-to-many relationship between table products and table users
    createTableProducts_Users: (req, res) => {
        sequelize.query(`
        drop table if exists products_users;
        create table products_users (
            products_users_id serial primary key,
            product_id INTEGER NOT NULL REFERENCES products(product_id),
            user_id INTEGER NOT NULL REFERENCES users(user_id) 
        )        
        `) 
        .then((res) => {
            console.log('Table products_users (middle table in many-to-many relationship) created!');
        })
        .catch((err) => {
            console.log(err); 
        })
    },

    // middle table to create many-to-many relationship between table products and table carts
    createTableProducts_Carts: (req, res) => {
        sequelize.query(`
        drop table if exists products_carts;
        create table products_carts (
            products_carts_id serial primary key,
            product_id INTEGER NOT NULL REFERENCES products(product_id),
            cart_id INTEGER NOT NULL REFERENCES carts(cart_id) 
        )        
        `) 
        .then((res) => {
            console.log('Table products_carts (middle table in many-to-many relationship) created!');
        })
        .catch((err) => {
            console.log(err); 
        })
    }
}

module.exports.seedProducts();
module.exports.seedUsers();
module.exports.createTableCart();
module.exports.createTableOrders();
module.exports.createTableProducts_Users();
module.exports.createTableProducts_Carts();
module.exports.createTableProducts_Orders();
