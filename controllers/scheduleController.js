const db = require("../config/db");

// Render schedule form with user data
exports.renderScheduleForm = (req, res) => {
  if (!req.session.user) {
    req.flash("error", "Please log in first.");
    return res.redirect("/login");
  }

  const userId = req.session.user.id;

  // Fetch user details
  db.query("SELECT fname, lname, contacts, address FROM users WHERE id = ?", [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error");
    }

    if (results.length === 0) {
      req.flash("error", "User not found.");
      return res.redirect("/login");
    }

    res.render("schedule", { user: results[0] });
  });
};

// Fetch unique brands
exports.getBrands = (req, res) => {
  db.query("SELECT DISTINCT brand FROM vehicles", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(results.map(row => row.brand));
  });
};

// Fetch models based on selected brand
exports.getModels = (req, res) => {
  const brand = req.query.brand;
  db.query("SELECT DISTINCT model FROM vehicles WHERE brand = ?", [brand], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json([]);
    }
    res.json(results.map(row => row.model));
  });
};

// Add appointment function
exports.addAppointment = async (req, res) => {
    console.log(req.body); // Debug: Check if form data is received
    console.log(req.session.user); // Debug: Check if user session exists

    if (!req.session.user) {
        req.flash("error", "You must be logged in to schedule an appointment.");
        return res.redirect("/login");
    }

    let user_id = req.session.user.id; // Get user ID from session
    let { first_name, last_name, contact, address, brand, model, vtype, stype, des, dCreated } = req.body;

    if (!first_name || !last_name || !contact || !address || !brand || !model || !vtype || !stype || !des || !dCreated) {
        req.flash("error", "All fields are required.");
        return res.redirect("/dashboard");
    }

    let formattedDateTime = new Date(dCreated).toISOString().slice(0, 19).replace("T", " ");

    let sql = `INSERT INTO requests (user_id, first_name, last_name, contact, address, dCreated, brand, model, vtype, stype, des, status) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;

    let values = [user_id, first_name, last_name, contact, address, formattedDateTime, brand, model, vtype, stype, des];

    try {
        await db.query(sql, values);
        req.flash("success", "Appointment scheduled successfully!");
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        req.flash("error", "Failed to schedule appointment.");
        res.redirect("/dashboard");
    }

};
