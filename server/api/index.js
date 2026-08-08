const app = require('../src/app');
const connectDB = require('../src/config/db');

let isConnected = false;

// Serverless function entrypoint for Vercel
module.exports = async (req, res) => {
    // Only connect if not already connected
    if (!isConnected) {
        await connectDB();
        isConnected = true;
    }
    
    // Delegate the request to the Express app
    return app(req, res);
};
