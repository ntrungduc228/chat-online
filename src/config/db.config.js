const mongoose = require('mongoose');

const DB_LOCAL_NAME = process.env.DB_LOCAL_NAME || 'chat-online';
const DB_URI = process.env.DB_URI || `mongodb://localhost:27017/${DB_LOCAL_NAME}`;

const typeOfDB = process.env.DB_URI ? 'clouds' : 'local';

/**
 * Connect to MongoDB
 */

async function connect(){
    try{
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log(`Connected to mongodb ${typeOfDB} successfully !!!`);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = { connect };