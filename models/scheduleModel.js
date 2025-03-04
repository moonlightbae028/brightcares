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

module.exports = Schedule;
