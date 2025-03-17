const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

router.get('/requests', adminController.getAllRequests);
// View Pending Requests
router.get("/pending", adminController.viewPendingRequests);

// Approve Request
router.post("/admin/requests/approve/:id", adminController.approveRequest);
router.get("/approved", adminController.viewApprovedRequests);

// Reject Request
router.post("/admin/requests/reject/:id", adminController.rejectRequest);

// Approve & Schedule Request ✅
router.post("/admin/requests/approve/:id", adminController.approveRequest);

// Assign Mechanic ✅
router.post("/admin/requests/assign/:id", adminController.assignMechanic);

// Update Schedule ✅
router.post("/admin/requests/update-schedule/:id", adminController.updateSchedule);

// Mark as Ongoing ✅
//router.post("/admin/requests/ongoing/:id", adminController.markAsOngoing);
//router.get("/admin/requests/approved", adminController.viewApprovedRequests);

router.get("/products/products", adminController.getAllProducts);

// Get a single product by ID
router.get('products/:id', adminController.getProductById);
router.get('/admin/products/add', (req, res) => {
    res.render('admin/products/add'); // Correct view path
});

// Add a new product
router.post('/admin/products/add', adminController.addProduct);
router.get('/admin/products/update/:id', adminController.showUpdateForm);
// Update an existing product
router.post('/admin/products/update/:id', adminController.updateProduct);

// Delete a product
router.get('/admin/delete/:id', adminController.deleteProduct);

module.exports = router;
