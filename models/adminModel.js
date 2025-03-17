const db = require('../config/db'); // Database connection

const adminModel = {
    // Get all requests
    getAllRequests: (callback) => {
        const sql = "SELECT * FROM requests ORDER BY dCreated DESC";
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },

    // Get pending requests
    getPendingRequests: (callback) => {
        const sql = "SELECT * FROM requests WHERE status = 'Pending'";
        db.query(sql, (err, results) => {
            if (err) return callback(err, null); // Proper error handling
            callback(null, results);
        });
    },

    // Update request status (Approve/Reject)
    updateRequestStatus: (id, status, callback) => {
        const sql = "UPDATE requests SET status = ? WHERE id = ?";
        db.query(sql, [status, id], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },
    updateRequestStatus: (id, status, scheduled_at, callback) => {
        const sql = "UPDATE requests SET status = ?, scheduled_at = ? WHERE id = ?";
        db.query(sql, [status, scheduled_at, id], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    assignMechanic: (requestId, mechanicId, callback) => {
        const sql = "UPDATE requests SET mechanic_id = ? WHERE id = ?";
        db.query(sql, [mechanicId, requestId], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    updateSchedule: (requestId, newDateTime, callback) => {
        const sql = "UPDATE requests SET scheduled_at = ? WHERE id = ?";
        db.query(sql, [newDateTime, requestId], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },

    markAsOngoing: (requestId, callback) => {
        const sql = "UPDATE requests SET status = 'Ongoing' WHERE id = ?";
        db.query(sql, [requestId], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    },
    getApprovedRequests: (callback) => {
        const sql = "SELECT * FROM requests WHERE status = 'Approved' ORDER BY scheduled_at ASC";
        db.query(sql, (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    },
    // Get all products
    getAllProducts: (callback) => {
        const sql = "SELECT * FROM products ORDER BY created_at DESC";
        db.query(sql, (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
        });
    },


    // Get product by ID
    getProductById: (id, callback) => {
        const sql = "SELECT * FROM products WHERE id = ?";
        db.query(sql, [id], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result[0]); // Return single product
        });
    },

    // Add a new product
    addProduct: (name, description, price, stock, category, image, callback) => {
        const sql = "INSERT INTO products (name, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sql, [name, description, price, stock, category, image], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },

    // Update product details
    updateProduct: (id, updatedData, callback) => {
        const { name, description, price, stock, category, image } = updatedData;
        const sql = "UPDATE products SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ? WHERE id = ?";
        db.query(sql, [name, description, price, stock, category, image, id], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },

    // Delete a product
    deleteProductById: (productId, callback) => {
        const query = 'DELETE FROM products WHERE id = ?';

        db.query(query, [productId], (err, results) => {
            if (err) {
                return callback(err); // If there's an error, pass it to the callback
            }
            callback(null); // Successfully deleted, pass null to callback
        });
    },

    // Update stock quantity
    updateStock: (id, stock, callback) => {
        const sql = "UPDATE products SET stock = ? WHERE id = ?";
        db.query(sql, [stock, id], (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        });
    },
};





// ✅ Properly export the model
module.exports = adminModel;
