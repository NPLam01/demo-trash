const express = require('express')
const dotenv  = require('dotenv')
const mongoose = require('mongoose')
const webRoutes = require('./routes/index')
const cors = require('cors')
const bodyParser = require('body-parser')

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use(bodyParser.json())

// Mount routes
webRoutes(app)

// List all registered routes
app._router.stack.forEach((middleware) => {
    if (middleware.route) {
        console.log(`Route: ${Object.keys(middleware.route.methods)} ${middleware.route.path}`);
    } else if (middleware.name === 'router') {
        middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                console.log(`Route: ${Object.keys(handler.route.methods)} ${handler.route.path}`);
            }
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
    console.log('404 Not Found:', req.method, req.url);
    res.status(404).json({ message: 'Route not found' });
});

mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect Db Success')
    })
    .catch((err) =>{
        console.error('MongoDB connection error:', err)
    })

app.listen(port, () => {
    console.log("Server is running with port :", port)
})