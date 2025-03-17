const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/scheduleController");
const db = require("../config/db");
// User dashboard - List appointments
const isAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login page if not authenticated
    }
    next();
};

router.get("/dashboard", isAuthenticated,  scheduleController.getSchedule);

router.post('/schedule/cancel/:appointmentId', async (req, res) => {
    const { appointmentId } = req.params;
    const userId = req.session.user ? req.session.user.id : null; // Get userId from session

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const [result] = await db.query(
            "UPDATE requests SET status = 'Cancelled' WHERE id = ? AND user_id = ? AND status = 'Pending'", 
            [appointmentId, userId]
        );

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'Appointment cancelled successfully' });
        } else {
            res.status(404).json({ error: 'No pending appointment found or invalid user' });
        }
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});
//router.post("/cancel/:id", scheduleController.cancelAppointment);

//router.get("/dashboard", appointmentController.getSchedule);
//router.get("/appointment/:id", scheduleController.getAppointmentDetails);
//router.post("/cancel-appointment", scheduleController.cancelRequest);

//router.post("/cancel/:id", scheduleController.cancelAppointment);
router.post("/add", scheduleController.addAppointment);


// Render schedule form
router.get("/", scheduleController.renderScheduleForm);

// Fetch vehicle brands
router.get("/getBrands", scheduleController.getBrands);

// Fetch vehicle models based on brand
router.get("/getModels", scheduleController.getModels);


module.exports = router;
