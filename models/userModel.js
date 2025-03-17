const db = require("../config/db");
const bcrypt = require("bcrypt");

// Create a new user (Registration)
exports.createUser = (userData, callback) => {
  bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
    if (err) return callback(err, null);

    const sql =
      "INSERT INTO users (fname, lname, email, contacts, gender, address, username, password, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      userData.fname,
      userData.lname,
      userData.email,
      userData.contacts,
      userData.gender,
      userData.address,
      userData.username,
      hashedPassword,
      userData.role || "user",
    ];

    db.query(sql, values, (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    });
  });
};

// Get a user by username
exports.getUserByUsername = (username, callback) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], (err, results) => {
    if (err) return callback(err, null);
    if (results.length === 0) return callback(null, null);
    callback(null, results[0]);
  });
};


// Validate user login
exports.validateUser = (username, password, callback) => {
  const sql = "SELECT * FROM users WHERE username = ?";
  
  db.query(sql, [username], async (err, results) => {
    if (err) return callback(err, null);
    
    if (results.length === 0) return callback(null, null);

    const user = results[0];

    // Check if the password is correct
    const match = await bcrypt.compare(password, user.password);
    if (!match) return callback(null, null);

    // Return user details, including role
    callback(null, user);
  });
  exports.getUserById = (userId, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [userId], (err, results) => {
      if (err) return callback(err, null);
      if (results.length === 0) return callback(null, null);
      callback(null, results[0]);
    });
  };
};
