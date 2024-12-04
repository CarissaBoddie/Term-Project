const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET endpoints
router.get('/', productController.getAllProducts); // List all products
router.get('/:id', productController.getProductById); // Get a product by ID

// POST endpoints
router.post('/', productController.createProduct); // Add a new product

// PUT endpoints
router.put('/:id', productController.updateProduct); // Update a product by ID

// DELETE endpoints
router.delete('/:id', productController.deleteProduct); // Delete a product by ID

module.exports = router;
