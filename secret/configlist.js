const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    TOKEN_STRING: process.env.USER_TOKEN,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DB_ADDRESS: process.env.DB_ADDRESS
};