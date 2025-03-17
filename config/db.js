const mysql = require('mysql2/promise');

// Setup the MySQL connection
const db = mysql.createPool({
    host: 'localhost',  // Ensure this is correct
    user: 'root',       // Your MySQL username
    password: '',       // Your MySQL password (leave empty if none)
    database: 'capstone' // Your database name
});

// Test the connection
(async () => {
    try {
        const connection = await db.getConnection(); // Test the connection
        console.log('Connected to the database');
        connection.release(); // Release the connection back to the pool
    } catch (err) {
        console.error('Database connection failed:', err);
    }
})();

// Export the database connection
module.exports = db;
