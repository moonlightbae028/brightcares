const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

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

// Login & Registration Routes
router.get("/register", (req, res) => res.render("register", { messages: req.flash() }));
router.post("/register", userController.registerUser);
router.get("/login", (req, res) => res.render("login", { messages: req.flash() }));
router.post("/login", userController.loginUser);
router.get("/logout", userController.logoutUser);

// User Dashboard
router.get("/dashboard", isLoggedIn, (req, res) => {
  res.render("dashboard", { user: req.session.user });
});

// Admin Dashboard
router.get("/admin/dashboard", isLoggedIn, isAdmin, (req, res) => {
  res.render("admin_dashboard", { user: req.session.user });
});

module.exports = router;
