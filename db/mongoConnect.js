const mongoose = require('mongoose');
const { DB_ADDRESS } = require('../secret/configlist');
const connectToDB = async() =>{
    try {
        
        await mongoose.connect(`mongodb://${DB_ADDRESS}/semifinal-project`);
        console.log('mongodb started...');
        

        
        
    } catch (error) {
        console.error(error);
        
        
    }
};
module.exports = connectToDB;