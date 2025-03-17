const adminModel = require('../models/adminModel'); // Ensure this is correct

const adminController = {
    // Get All Requests
    getAllRequests: (req, res) => {
        adminModel.getAllRequests((err, requests) => {
            if (err) {
                return res.status(500).send("Database error");
            }
            res.render('admin/request', { requests }); // Pass requests to the view
        });
    },

    // View Pending Requests
    viewPendingRequests: (req, res) => {
        adminModel.getPendingRequests((err, requests) => { // Use adminModel (not Admin)
            if (err) {
                return res.status(500).send("Database error");
            }
            res.render("admin/pending", { pendingRequests: requests });
        });
    },

    // Approve Request
    approveRequest: (req, res) => {
        const requestId = req.params.id;
        adminModel.updateRequestStatus(requestId, "Approved", (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Approval failed" });
            }
            res.json({ success: true, message: "Request approved successfully!" });
        });
    },

    // Reject Request
    rejectRequest: (req, res) => {
        const requestId = req.params.id;
        adminModel.updateRequestStatus(requestId, "Rejected", (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Rejection failed" });
            }
            res.json({ success: true, message: "Request rejected successfully!" });
        });
    },
    approveRequest: (req, res) => {
        const requestId = req.params.id;
        const scheduled_at = req.body.scheduled_at; // Admin provides a date & time

        adminModel.updateRequestStatus(requestId, "Approved", scheduled_at, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error approving request" });
            res.json({ success: true, message: "Request approved and scheduled!" });
        });
    },

    assignMechanic: (req, res) => {
        const requestId = req.params.id;
        const mechanicId = req.body.mechanic_id;

        adminModel.assignMechanic(requestId, mechanicId, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error assigning mechanic" });
            res.json({ success: true, message: "Mechanic assigned successfully!" });
        });
    },

    updateSchedule: (req, res) => {
        const requestId = req.params.id;
        const newDateTime = req.body.newDateTime;

        adminModel.updateSchedule(requestId, newDateTime, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error updating schedule" });
            res.json({ success: true, message: "Schedule updated successfully!" });
        });
    },

    markAsOngoing: (req, res) => {
        const requestId = req.params.id;

        adminModel.markAsOngoing(requestId, (err) => {
            if (err) return res.status(500).json({ success: false, message: "Error marking as ongoing" });
            res.json({ success: true, message: "Request is now ongoing!" });
        });
    },
    // View Approved Requests
    viewApprovedRequests: (req, res) => {
        adminModel.getApprovedRequests((err, approvedRequests) => {
            if (err) {
                return res.status(500).send("Database error");
            }
            res.render("admin/approved", { approvedRequests }); // Render the approved.ejs view
        });
    },
     // Get All Products
    // View All Products
    getAllProducts: (req, res) => {
        adminModel.getAllProducts((err, products) => {
            if (err) return res.status(500).send("Database error");
            res.render('admin/products/products', { products }); // Ensure correct view path
        });
    },

    // Get Product by ID
    getProductById: (req, res) => {
        const productId = req.params.id;
        productModel.getProductById(productId, (err, product) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error fetching product" });
            }
            res.json({ success: true, product });
        });
    },

addProduct: (req, res) => {
    const { name, description, price, stock, category, image } = req.body;

    adminModel.addProduct(name, description, price, stock, category, image, (err) => {
        if (err) {
            req.flash('error', 'Error adding product!');
            return res.redirect('/admin/products/add');
        }

        req.flash('success', 'Product added successfully!');
        return res.redirect('/admin/products/add');
    });
},


    // Update Product
    updateProduct: (req, res) => {
        const productId = req.params.id;
        const updatedData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,
            stock: req.body.stock,
            image: req.body.image || ''  // Default empty string if no image URL is provided
        };

        // Call model function to update the product in the database
        adminModel.updateProduct(productId, updatedData, (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error updating product" });
            }
            // After successful update, redirect to product listing page or show success message
            res.redirect('/products/products');  // Redirect to the product list page after update
        });
    },

    deleteProduct: (req, res) => {
        const productId = req.params.id;
        adminModel.deleteProductById(productId, (err) => {
            if (err) {
                req.flash('error', 'Error deleting product!');
                return res.redirect('/admin/products');
            }
    
            req.flash('success', 'Product deleted successfully!');
            return res.redirect('/products/products');  // Redirect to products list page
        });
    },

    // Get Products by Category
    getProductsByCategory: (req, res) => {
        const category = req.params.category;
        productModel.getProductsByCategory(category, (err, products) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error fetching products by category" });
            }
            res.json({ success: true, products });
        });
    },
    showUpdateForm: (req, res) => {
        const productId = req.params.id;
    
        // Fetch the product by ID from the model
        adminModel.getProductById(productId, (err, product) => {
            if (err || !product) {
                return res.status(404).send("Product not found");
            }
    
            // Render the update view and pass the product data
            res.render('admin/products/update', { product: product });
        });
    }




};

// Export the controller correctly
module.exports = adminController;
