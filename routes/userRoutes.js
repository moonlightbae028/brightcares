const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const db = require('../config/db');


router.get("/", (req, res) => {
  res.render("index");
});

// Register Routes
router.get("/register", (req, res) => {
  res.render("register", { messages: req.flash() });
});
router.post("/register", userController.registerUser);

// Login Routes
router.get("/login", (req, res) => {
  res.render("login", { messages: req.flash() });
});
router.post("/login", userController.loginUser);

// Logout Route
router.get("/logout", userController.logoutUser);
router.get("/dashboard", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login"); // Redirect if not logged in
  }

  const userId = req.session.user.id;
  console.log("Logged-in User ID:", userId);

  db.query("SELECT * FROM requests WHERE user_id = ?", [userId], (error, results) => {
    if (error) {
      console.error("Database Query Error:", error);
      return res.render("dashboard", { user: req.session.user, requests: [] });
    }

    console.log("Retrieved Requests:", results);
    res.render("dashboard", { user: req.session.user, requests: results });
  });
});

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    req.flash("error", "Please log in first.");
    return res.redirect("/login");
  }
  next();
}
// Middleware to check if user is an admin
function isAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== "admin") {
    req.flash("error", "Unauthorized access.");
    return res.redirect("/dashboard");
  }
  next();
}

// Admin Dashboard
router.get("/admin/dashboard", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin_dashboard", { user: req.session.user });
});


module.exports = router;
