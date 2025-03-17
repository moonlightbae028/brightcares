const userModel = require("../models/userModel");
const db = require('../config/db');
const bcrypt = require("bcrypt");

exports.registerUser = (req, res) => {
  const userData = req.body;

  userModel.createUser(userData, (err, result) => {
    if (err) {
      console.error(err);
      req.flash("error", "Registration failed!");
      return res.redirect("/register");
    }
    req.flash("success", "Registration successful! You can now log in.");
    res.redirect("/login");
  });
};

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  userModel.validateUser(username, password, (err, user) => {
    if (err) {
      console.error("Login error:", err);
      req.flash("error", "An error occurred during login.");
      return res.redirect("/login");
    }

    if (!user) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      fname: user.fname,
    };

    console.log("User logged in:", req.session.user);
    req.flash("success", `Welcome, ${user.fname}!`);

    return res.redirect(user.role === "admin" ? "/admin/dashboard" : "/dashboard");
  });
};


// Logout function
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
