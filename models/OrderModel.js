const db = require('../config/db');


class CartModel {
    static async getCartItems(userId) {
        try {
            // Execute the query
            const result = await db.execute(`
                SELECT c.id, c.user_id, c.product_id, c.quantity, c.created_at, 
                       p.name AS product_name, p.price, p.image 
                FROM cart c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ?
            `, [userId]);

            // Extract the rows from the result
            const rows = result[0]; // First element is the result set (rows)

            // Return the rows (cart items)
            return rows;
        } catch (err) {
            console.error(`Error in getCartItems for user ID: ${userId}`, err);
            throw err; // Re-throw the error to be handled by the controller
        }
    }
}

module.exports = CartModel;