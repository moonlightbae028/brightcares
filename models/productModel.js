const db = require('../config/db'); // Your MySQL connection

const productModel = {
    getAllProducts: (callback) => {
        const sql = 'SELECT * FROM products';
        db.query(sql, (err, results) => {
            if (err) {
                console.error('Error fetching products:', err);
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    },
    getProductById : (productId, callback) => {
        console.log(`🔍 Querying product ID: ${productId}`); // Debugging
        const sql = "SELECT * FROM products WHERE id = ?";
        
        db.query(sql, [productId], (err, results) => {
            if (err) {
                console.error("❌ Database error in getProductById:", err);
                return callback(err, null);
            }
            if (results.length === 0) {
                console.log("⚠️ Product not found in database.");
                return callback(null, null);
            }
            console.log("✅ Product found:", results[0]);
            callback(null, results[0]);
        })
    },


    updateStock: (id, newStock, callback) => {
        db.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, id], callback);
    },
    createOrder: (userId, productId, totalPrice, paymentMethod) => {
        return new Promise((resolve, reject) => {
            db.query(
                "INSERT INTO orders (user_id, product_id, total_price, payment_method, status) VALUES (?, ?, ?, ?, 'Pending')",
                [userId, productId, totalPrice, paymentMethod],
                (err, results) => {
                    if (err) reject(err);
                    resolve(results);
                }
            );
        });
    } 

};

module.exports = productModel;
