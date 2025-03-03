const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const db = require('./config/db');

const app = express();

// ✅ Setup session middleware (needed for flash messages)
app.use(
  session({
    secret: "your_secret_key", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
  })
);

// ✅ Enable flash messages
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(userRoutes);


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
