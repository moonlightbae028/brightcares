const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');

// Route to display the cart
router.get('/cart/:userId', CartController.getCart);

router.get("/:userId", CartController.getCart);
router.post("/:userId/checkout", CartController.checkout);

module.exports = router;
