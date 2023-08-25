const mongoose = require('mongoose');

const MONGODB_URL = 'mongodb://127.0.0.1:27017/logspace';


const connectToMongo = () => {
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connection Successful');
        })
        .catch(e => {
            console.log(e.message);
        });
}

module.exports = connectToMongo;