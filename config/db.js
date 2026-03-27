const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ MongoDB Connection Error: ${err.message}`);
        console.error(`💡 Suggestion: Ensure your IP address is whitelisted in MongoDB Atlas: https://www.mongodb.com/docs/atlas/security-whitelist/`);
        // In some environments, exiting the process is preferred, but for local 
        // development we might want to keep the server running to see other logs.
        // process.exit(1); 
    }
};

module.exports = connectDB;
