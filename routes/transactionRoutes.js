const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Define routes for money transfers, deposit, withdrawal, and transaction history
router.post('/transfer', transactionController.transfer);
router.post('/deposit', transactionController.deposit);
router.post('/withdraw', transactionController.withdraw);
router.get('/history', transactionController.transactionHistory);

module.exports = router;
