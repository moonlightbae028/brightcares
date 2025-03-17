const userModel = require('../models/userModel');
const productModel = require('../models/productModel');
const orderModel = require('../models/OrderModel');

const orderController = {
    reviewOrder: (req, res) => {
        const productId = req.params.id;
        const userId = req.session.userId; // Assuming session stores user ID

        if (!userId) {
            return res.redirect('/login');
        }

        userModel.getUserById(userId, (err, user) => {
            if (err || !user) return res.status(500).send("Error fetching user details");

            productModel.getProductById(productId, (err, product) => {
                if (err || !product) return res.status(404).send("Product not found");

                res.render('review', { user, product });
            });
        });
    },

    processCheckout: (req, res) => {
        const userId = req.session.userId;
        const { productId, deliveryMethod } = req.body;
        const quantity = 1; // Default quantity for now

        if (!userId) {
            return res.redirect('/login');
        }

        productModel.getProductById(productId, (err, product) => {
            if (err || !product) return res.status(404).send("Product not found");

            if (product.stock < quantity) {
                return res.status(400).send("Not enough stock available");
            }

            const totalPrice = product.price * quantity;

            productModel.updateStock(productId, product.stock - quantity, (updateErr) => {
                if (updateErr) return res.status(500).send("Error updating stock");

                orderModel.createOrder(userId, productId, quantity, totalPrice, deliveryMethod, (orderErr) => {
                    if (orderErr) return res.status(500).send("Error processing order");
                    res.redirect('/order-success');
                });
            });
        });
    }
};

module.exports = orderController;
