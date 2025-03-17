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


exports.addAppointment = async (req, res) => {
    console.log(req.body);
    console.log(req.session.user);

    if (!req.session.user) {
        req.flash("error", "You must be logged in to schedule an appointment.");
        return res.redirect("/login");
    }
    
    let user_id = req.session.user.id;
    let { first_name, last_name, contact, address, brand, model, vtype, stype, des, dCreated } = req.body;

    if (!first_name || !last_name || !contact || !address || !brand || !model || !vtype || !stype || !des || !dCreated) {
        req.flash("error", "All fields are required.");
        return res.redirect("/dashboard");
    }

    try {
      let formattedDateTime = new Date(dCreated).toISOString().slice(0, 19).replace("T", " ");
  
      // Store `des` as plain text (comma-separated string)
      let description = req.body.des; // No JSON conversion
  
      let sql = `INSERT INTO requests (user_id, first_name, last_name, contact, address, dCreated, brand, model, vtype, stype, des, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`;
  
      let values = [user_id, first_name, last_name, contact, address, formattedDateTime, brand, model, vtype, stype, description];
  
      await db.query(sql, values);
  
      req.flash("success", "Appointment scheduled successfully!");
      res.redirect("/dashboard");
  } catch (err) {
      console.error("Database Error:", err);
      req.flash("error", "Failed to schedule appointment.");
      res.redirect("/dashboard");
  }
 };  

exports.getSchedule = async (req, res) => {
  try {
    const userId = req.session.user ? req.session.user.id : null;

    if (!userId) {
      console.error("User ID is missing from session");
      return res.status(401).send("Unauthorized");
    }

    console.log(userId);

    // ✅ Fetch from `requests` table instead of `appointments`
    const [requests] = await db.execute(
      "SELECT * FROM requests WHERE user_id = ?",
      [userId]
    );

    res.render("dashboard", { requests });
  } catch (error) {
    console.error("Error retrieving requests:", error);
    res.status(500).send("Error retrieving requests");
  }
};

exports.viewAppointment = async (req, res) => {
  let appointmentId = req.params.id;

  try {
      let sql = `SELECT * FROM requests WHERE id = ?`;
      let [rows] = await db.execute(sql, [appointmentId]);

      if (rows.length === 0) {
          req.flash("error", "Appointment not found.");
          return res.redirect("/dashboard");
      }

      res.render("appointment", { appointment: rows[0] }); // Render view with appointment details
  } catch (err) {
      console.error("Database Error:", err);
      req.flash("error", "Failed to fetch appointment details.");
      res.redirect("/dashboard");
  }
};

exports.cancelAppointment = (req, res) => {
  const { id } = req.params;

  Appointment.cancelAppointment(id, (err, result) => {
      if (err) {
          return res.status(500).json({ success: false, message: "Database error." });
      }
      res.json({ success: true, message: "Appointment cancelled successfully." });
  });
};



