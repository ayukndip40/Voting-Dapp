const express = require('express');
const { register, login, logout, getCurrentUser } = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

// Route Definitions

// Register a new user
router.post('/register', register);

// Login user with validation
router.post('/login', login);

// Logout user (requires authentication)
router.post('/logout', authenticateToken, logout);

// Get current user information (requires authentication)
router.get('/current', authenticateToken, getCurrentUser);

module.exports = router;
