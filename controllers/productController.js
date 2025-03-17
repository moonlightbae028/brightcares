const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
//const OrderModel = require('../models/OrderModel');
const db = require("../config/db");

const productController = {
    viewProducts: (req, res) => {
        productModel.getAllProducts((err, products) => {
            if (err) return res.status(500).send('Error fetching products');
            res.render('products', { products });
        });
    },

    viewProductById: (req, res) => {
        const productId = req.params.id;
        productModel.getProductById(productId, (err, product) => {
            if (err) return res.status(500).send("Database error: " + err);
            if (!product) return res.status(404).send("Product not found");
            res.render("product", { product });
        });
    },
    checkoutPage : (req, res) => {
        console.log("Session at Checkout:", req.session); // Debugging
    
        const productId = req.params.id;
    
        if (!req.session.user || !req.session.user.id) {
            console.log("User not logged in!");
            return res.status(401).send("Please log in to proceed");
        }
    
        const userId = req.session.user.id; // Get user ID from session
    
        console.log(`Fetching product: ${productId}`);
        productModel.getProductById(productId, (err, product) => {
            if (err) {
                console.error("Error fetching product:", err);
                return res.status(500).send("Error loading product");
            }
            if (!product) {
                console.log("Product not found!");
                return res.status(404).send("Product not found");
            }
    
            console.log(`Fetching user: ${userId}`);
            userModel.getUserById(userId, (err, user) => {
                if (err) {
                    console.error("Error fetching user:", err);
                    return res.status(500).send("Error loading user");
                }
                if (!user) {
                    console.log("User not found!");
                    return res.status(404).send("User not found");
                }
    
                console.log("Rendering checkout page...");
                res.render("checkout", { user, product });
            });
        });
    },
    
    processCheckout: (req, res) => {
        const userId = req.session.user.id;
        const productId = req.params.id;
        const quantity = req.body.quantity || 1; // Default to 1 if not provided
        const price = req.body.price || 0; // Ensure price is passed
        const deliveryMethod = req.body.deliveryMethod; 
    
        const totalPrice = quantity * price; // Calculate total price
    
        // Check stock before placing the order
        const checkStockQuery = `SELECT stock FROM products WHERE id = ?`;
    
        db.query(checkStockQuery, [productId], (err, result) => {
            if (err) {
                console.error("Error checking stock:", err);
                return res.status(500).send("Error processing order");
            }
    
            if (result.length === 0) {
                return res.status(400).send("Product not found");
            }
    
            const currentStock = result[0].stock;
            if (currentStock < quantity) {
                return res.status(400).send("Not enough stock available");
            }
    
            // Insert order into orders table
            const insertOrderQuery = `
                INSERT INTO orders (user_id, product_id, quantity, total_price, delivery_method) 
                VALUES (?, ?, ?, ?, ?)
            `;
    
            db.query(insertOrderQuery, [userId, productId, quantity, totalPrice, deliveryMethod], (err, result) => {
                if (err) {
                    console.error("Error saving order:", err);
                    return res.status(500).send("Error processing order");
                }
    
                // Decrease the stock after order confirmation
                const updateStockQuery = `UPDATE products SET stock = stock - ? WHERE id = ?`;
    
                db.query(updateStockQuery, [quantity, productId], (err, updateResult) => {
                    if (err) {
                        console.error("Error updating stock:", err);
                        return res.status(500).send("Error updating stock");
                    }
    
                    console.log("Order placed successfully and stock updated!");
                    res.redirect("/order-success");
                });
            });
        });
    }
};
    
module.exports = productController;