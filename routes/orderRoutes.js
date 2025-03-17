const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/review/:id', orderController.reviewOrder);
router.post('/checkout', orderController.processCheckout);

module.exports = router;
