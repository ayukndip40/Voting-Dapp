const express = require('express');
const adminController = require('../controllers/adminController');
const {adminAuth} = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// @route    GET api/admin/users
// @desc     Get all users
// @access   Private/Admin
router.get('/users', [authMiddleware.authenticateToken, adminAuth], adminController.getAllUsers);

// @route    DELETE api/admin/users/:id
// @desc     Delete a user
// @access   Private/Admin
router.delete('/users/:id', [authMiddleware.authenticateToken, adminAuth], adminController.deleteUser);

module.exports = router;
