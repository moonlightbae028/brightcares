const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const db = require('../config/db');
// Route to show dashboard
//router.get("/", scheduleController.viewDashboard);
// Ensure this route exists!
router.post("/add", scheduleController.addAppointment);


// Render schedule form
router.get("/", scheduleController.renderScheduleForm);

// Fetch vehicle brands
router.get("/getBrands", scheduleController.getBrands);

// Fetch vehicle models based on brand
router.get("/getModels", scheduleController.getModels);

module.exports = router;
