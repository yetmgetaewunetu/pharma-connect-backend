const mongoose = require('mongoose');
require('dotenv').config()


// Connect to DB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONN_STR);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.log("MongoDB failed to connect.",error);
        process.exit(1)
    }
}
 
module.exports = connectDB;
 