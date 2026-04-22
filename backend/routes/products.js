const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a product
// POST /products
router.post('/', async (req, res) => {
    try {
        const { name, quantity, price, expiry_date, vendor_id, is_surplus } = req.body;

        // Input validation
        if (!name || quantity == null || price == null || !expiry_date || !vendor_id) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newProduct = await db.query(
            `INSERT INTO products (name, quantity, price, expiry_date, vendor_id, is_surplus) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [name, quantity, price, expiry_date, vendor_id, is_surplus || false]
        );

        res.status(201).json(newProduct.rows[0]);
    } catch (err) {
        console.error('Error in POST /products:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get all products
// GET /products
router.get('/', async (req, res) => {
    try {
        const allProducts = await db.query(
            `SELECT p.*, v.name as vendor_name, v.shop_name 
             FROM products p 
             LEFT JOIN vendors v ON p.vendor_id = v.id
             ORDER BY p.created_at DESC`
        );
        res.status(200).json(allProducts.rows);
    } catch (err) {
        console.error('Error in GET /products:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Get single product
// GET /products/:id
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await db.query('SELECT * FROM products WHERE id = $1', [id]);

        if (product.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json(product.rows[0]);
    } catch (err) {
        console.error('Error in GET /products/:id:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

// Delete product
// DELETE /products/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProduct = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

        if (deleteProduct.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (err) {
        console.error('Error in DELETE /products/:id:', err.message);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
