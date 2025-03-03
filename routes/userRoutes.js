const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

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
router.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    req.flash("error", "Please log in first.");
    return res.redirect("/login");
  }

  res.render("dashboard", { user: req.session.user });
});


module.exports = router;
