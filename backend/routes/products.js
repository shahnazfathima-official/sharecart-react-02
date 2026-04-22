const express = require('express');
const router = express.Router();
const db = require('../db');

// Add a product
// POST /products
router.post('/', async (req, res) => {
    try {
        const { name, quantity, price, expiry_date, vendor_id, seller_name, is_surplus, image_url } = req.body;

        let actualVendorId = vendor_id;

        // If the user's ID isn't in our Supabase vendors table yet, auto-create their shop!
        if (!actualVendorId || isNaN(actualVendorId)) {
            const newVendor = await db.query(
                `INSERT INTO vendors (name, shop_name, location) VALUES ($1, $2, 'Local Store') RETURNING id`,
                [seller_name || 'Cake shop', seller_name || 'Cake shop']
            );
            actualVendorId = newVendor.rows[0].id;
        }

        const newProduct = await db.query(
            `INSERT INTO products (name, quantity, price, expiry_date, vendor_id, is_surplus, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, quantity, price, expiry_date, actualVendorId, is_surplus || false, image_url]
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
        res.status(500).json({ error: "Server error", details: err.message });
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
