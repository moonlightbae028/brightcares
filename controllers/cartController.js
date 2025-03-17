const CartModel = require('../models/cartModel');

class CartController {
    static async getCart(req, res) {
        let userId = req.params.userId;
        if (isNaN(userId)) {
            console.error(`Invalid user ID: ${userId}`);
            return res.render('cart', { cart: [], user: { id: null }, error: 'Invalid user ID' });
        }
        userId = parseInt(userId); // Convert to number
        console.log(`Fetching cart for user ID: ${userId}`);

        try {
            const cartItems = await CartModel.getCartItems(userId);
            console.log('Fetched Cart Items:', cartItems);
            res.render('cart', { cart: cartItems, user: { id: userId } });
        } catch (err) {
            console.error(`Error fetching cart for user ID: ${userId}`, err);
            res.render('cart', { cart: [], user: { id: userId } });
        }
    }
    static async checkout(req, res) {
        let userId = req.params.userId;
        if (isNaN(userId)) {
            console.error(`Invalid user ID: ${userId}`);
            return res.status(400).json({ message: "Invalid user ID" });
        }
        userId = parseInt(userId);

        const { cartItems } = req.body;
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "No items in the cart" });
        }

        console.log(`Processing checkout for user ID: ${userId}`);

        try {
            const result = await CartModel.processCheckout(userId, cartItems);
            if (result.success) {
                return res.json({ message: "Checkout successful!" });
            } else {
                return res.status(400).json({ message: result.message });
            }
        } catch (err) {
            console.error(`Checkout error for user ID: ${userId}`, err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    
}

module.exports = CartController;
