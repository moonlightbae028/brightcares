const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require('./routes/cartRoutes');
//const viewscheduleRoutes = require("./routes/appointment");
//const db = require('./config/db');

const app = express();

// ✅ Setup session middleware (needed for flash messages)
app.use(
  session({
    secret: "dasdasdsadas", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Make user data available in templates
  next();
});
// ✅ Enable flash messages
app.use(flash());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");
    next();
});
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.use(userRoutes);
app.use("/", adminRoutes);
//app.use('/', require('./routes/adminRoutes')); // Admin Routes
app.use('/schedule', scheduleRoutes); // This ensures /schedule works
const productRoutes = require('./routes/productRoutes');
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.post('/cart/add/:id', (req, res) => {
    const productId = req.params.id;
    const userId = req.session.user.id; 

    const sql = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)
                 ON DUPLICATE KEY UPDATE quantity = quantity + 1`;

    db.query(sql, [userId, productId], (err, result) => {
        if (err) {
            console.error("Error adding to cart:", err);
            return res.status(500).send("Error adding product to cart");
        }
        console.log("Product added to cart!");
        res.redirect('/cart'); // Redirect to cart page
    });
});

app.listen(3002, () => {
  console.log("Server running on http://localhost:3002");
});
