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

module.exports = {
    getAllProducts: (req, res) => {
        sequelize.query(`Select * from products;`)
            .then((dbres) => {
                console.log(dbres[0]);
                // console.log(res);
                return res.status(200).send(dbres[0]); 
            })
            .catch(err => console.log(err));
    }
}

// module.exports.getAllProducts(); // call this function to console.log the res and dbres[0], to check if query execute successfully