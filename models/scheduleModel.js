const db = require('../config/db');

class Schedule {
    static async getBrands() {
        return new Promise((resolve, reject) => {
            db.query('SELECT DISTINCT brand FROM vehicles', (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static async getModels(brand) {
        return new Promise((resolve, reject) => {
            db.query('SELECT model FROM vehicles WHERE brand = ?', [brand], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }

    static async getUserDetails(userId) {
        return new Promise((resolve, reject) => {
            db.query('SELECT fname, lname, contacts, address FROM users WHERE id = ?', [userId], (err, results) => {
                if (err) reject(err);
                else resolve(results[0]);
            });
        });
    }

    static async addSchedule(data) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO schedule SET ?', data, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
    }
}
class Appointment {
    // Fetch appointments for a specific user
    static async getUserAppointments(userId) {
        try {
            const [rows] = await db.query("SELECT * FROM requests WHERE user_id = ?", [userId]);
            return rows;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }

    // Cancel an appointment by ID (Only if it is pending)
    static async cancelAppointment(appointmentId, userId) {
        try {
            const [result] = await db.query(
                "UPDATE requests SET status = 'Cancelled' WHERE id = ? AND user_id = ? AND status = 'Pending'", 
                [appointmentId, userId]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("Database Error:", error);
            throw error;
        }
    }
}
class Request {
    static async getAllRequests() {
        try {
            const [requests] = await db.execute("SELECT * FROM requests");
            return requests;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = Schedule, Appointment, Request;
