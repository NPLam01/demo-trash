const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

// Debug logging
console.log('Setting up UserRoute...');

// Auth routes
router.post('/register', UserController.createUser);
router.post('/login', UserController.loginUser);

// User management routes
router.put('/update-user/:id', UserController.updateUser);
router.delete('/delete-user/:id', UserController.deleteUser); //admin
router.get('/getAll', UserController.getAllUser);   //admin
router.get('/details-user/:id', UserController.getDetailUser);   

// Log available routes
console.log('UserRoute paths:', router.stack.map(r => {
    return `${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`;
}));

module.exports = router;