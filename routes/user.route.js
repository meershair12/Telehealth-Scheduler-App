const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth');

// RESTful routes for Users
router.post('/create', userController.createUser);        // Create new user
router.get('/all',protect, userController.getAllUsers);         // Get all users
router.get('/:id', userController.getUserById);     // Get user by ID
router.put('/:id/update',protect, userController.updateUser);      // Update user
router.delete('/:id/delete',protect, userController.deleteUser);   // Delete user
router.patch('/change-password',protect, userController.changeUserPassword);   // Delete user

module.exports = router;
