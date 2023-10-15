const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Define routes related to user registration and authentication
router.post('/signup', userController.signup);
router.post('/signin', userController.signin);

module.exports = router;