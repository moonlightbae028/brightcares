const userModel = require("../models/userModel");

// Handle user registration
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

// Handle user login with role checking
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  userModel.validateUser(username, password, (err, user) => {
    if (err) {
      console.error(err);
      req.flash("error", "Login error occurred.");
      return res.redirect("/login");
    }
    if (!user) {
      req.flash("error", "Invalid username or password.");
      return res.redirect("/login");
    }

    // Store user session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role, // Store role
      fname: user.fname
    };

    console.log("User logged in:", req.session.user); // Debugging output

    req.flash("success", `Welcome, ${user.fname}!`);

    // Redirect user based on role
    if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    } else {
      return res.redirect("/dashboard");
    }
  });
};


// Logout function
exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
