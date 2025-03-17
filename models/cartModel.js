const db = require('../config/db'); // Use the updated db connection

class CartModel {
    static async getCartItems(userId) {
        try {
            const [rows] = await db.query(`
                SELECT c.id, c.user_id, c.product_id, c.quantity, c.created_at,
                       p.name AS product_name, p.price, p.image
                FROM cart c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ?
            `, [userId]);

            // Ensure 'rows' is always an array
            return Array.isArray(rows) ? rows : [];
        } catch (err) {
            console.error(`Error in getCartItems for user ID: ${userId}`, err);
            throw err;
        }
    }
    
    static async processCheckout(userId, cartItems) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            for (const item of cartItems) {
                const [product] = await connection.query("SELECT stock FROM tbl_product WHERE id = ?", [item.productId]);

                if (!product || product[0].stock < item.quantity) {
                    await connection.rollback();
                    return { success: false, message: `Insufficient stock for product ID: ${item.productId}` };
                }

                await connection.query(
                    "UPDATE tbl_product SET stock = stock - ? WHERE id = ?",
                    [item.quantity, item.productId]
                );
            }

            await connection.commit();
            return { success: true };
        } catch (err) {
            await connection.rollback();
            console.error("Checkout transaction failed:", err);
            throw err;
        } finally {
            connection.release();
        }
    }

}

module.exports = CartModel;
