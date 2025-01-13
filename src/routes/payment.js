const express = require('express');
const PaymentController = require('../controllers/PaymentController');
let router = express.Router();

router.post('/create_payment_url', PaymentController.createPaymentUrl);
router.get('/payment_information/:orderCode', PaymentController.getPaymentInformation);
router.post('/receive_hook', PaymentController.receiveHook);

module.exports = router;