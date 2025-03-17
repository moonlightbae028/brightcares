const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const db = require("../config/db");
// Route to display products

router.get('/products', productController.viewProducts);
router.get("/product/:id", productController.viewProductById);

// Route to display checkout page
router.get('/checkout/:id', productController.checkoutPage);

// Route to process order submission
router.post("/checkout/:id", productController.processCheckout);
router.post('/cart/add/:id', (req, res) => {
    const productId = req.params.id;
    const userId = req.session.user.id; 

    const sql = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)
                 ON DUPLICATE KEY UPDATE quantity = quantity + 1`;

    db.query(sql, [userId, productId], (err, result) => {
        if (err) {
            console.error("Error adding to cart:", err);
            req.flash('error_msg', 'Error adding product to cart');
            return res.redirect('/products');
        }

        req.flash('success_msg', 'Product added to cart successfully!');
        res.redirect('/products');
    });
});

router.post('/cart/add/:productId', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Ensure user is logged in
    }

    const userId = req.session.user.id; // Get logged-in user's ID
    const productId = req.params.productId;

    try {
        // Check if product is already in cart
        const [existing] = await db.execute(`
            SELECT * FROM cart WHERE user_id = ? AND product_id = ?
        `, [userId, productId]);

        if (existing.length > 0) {
            // Update quantity if item exists
            await db.execute(`
                UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?
            `, [userId, productId]);
        } else {
            // Insert new item into cart
            await db.execute(`
                INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)
            `, [userId, productId]);
        }

        res.redirect('/cart'); // Redirect to cart page
    } catch (err) {
        console.error(err);
        res.redirect('/products');
    }
});


router.get("/order-success", (req, res) => {
    res.render("order-success", { title: "Order Success" });
});


module.exports = router;
