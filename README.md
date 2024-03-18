# AUZZY THE BEAR


## Table of Contents

- [Summary](#summary)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Testing](#testing)
- [Local Installation](#installation)

## <a name="summary"></a>Summary

Auzzy the Bear is an e-commerce website I made for my friend's business



## <a name="features"></a>Features
[![Demo video](./assets/Video%20demo.png)](https://www.youtube.com/watch?v=L8U-3fkMGBw "AUZZY THE BEAR")


## <a name="tech-stack"></a>Tech Stack

**Back End:** Node.js, Express.js, Passport.js<br/>
**Front End:** JavaScript, AJAX, JSON, Bootstrap, HTML, CSS<br/>
**Database::** Postgresql, Sequelize (ORM)<br/>

## <a name="features"></a>Features

#### Registration and Log in
- Customer can register for a new user account 
- Log in session is implemented using Passport.js 

#### Browse product list and add products into cart

- Upon successful log in, customer can browse product list
- Customer can search for products using keywords
- Customer can add products into cart, increase and decrease product quantity in cart

#### View the cart and update product quantity in cart

- Customer can view products and each product's quantity in cart
- Customer can view unit total price for each product, and total bill amount
- Customer can increase and decrease quantity for each product in cart
- If the product quantity is decreased to 0, the product would no longer display in cart


## <a name="installation"></a>Local Installation


To run this app on local environment, please follow these steps:

Clone repository:

```
$ git clone https://github.com/tramypham2192/Shopping_App_Nodejs.git
```

#### Setup:

Install pgAdmin

Create a Postgresql database:

```
Change CONNECTION_STRING variable in server/controller.js as follows:
"postgresql://postgres:password@localhost/database_name"
(password is your pgadmin login password, database_name is the name of the database you created for this app)
```

Install dependencies:

```
$ npm install
```


#### Run the server:

```
$ nodemon server/server.js
```

- Once you run this command, tables are created and seeded with data in seed.js file


- In your browser, visit <a href="http://localhost:4000/html/index.html">http://localhost:4000/html/index.html</a>

- Click Register in log in screen and register for a new customer account

- Log in and start using the app

## Connect and learn more about My (Mee) Pham on <a href="https://www.linkedin.com/in/my-mee-pham/">LinkedIn</a>.
